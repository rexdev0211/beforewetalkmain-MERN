// ** React Imports
import Avatar from '@components/avatar'
import { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import { socket } from '../../utils/helper'


// ** Custom Components

// ** Third Party Components
import profilePic from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import classnames from 'classnames'
import { Image, Send } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Reactstrap Imports
import { Button, Card, CardHeader, Form, Input, InputGroup, InputGroupText, Label } from 'reactstrap'

// ** Images
// ** Styles
import '@styles/base/pages/app-chat-list.scss'

// const data = {
//   chat: {
//     id: 2,
//     userId: 1,
//     unseenMsgs: 0,
//     chat: [
//       {
//         message: "How can we help? We're here for you!",
//         time: 'Mon Dec 10 2018 07:45:00 GMT+0000 (GMT)',
//         senderId: 11
//       },
//       {
//         message: 'Hey John, I am looking for the best admin template. Could you please help me to find it out?',
//         time: 'Mon Dec 10 2018 07:45:23 GMT+0000 (GMT)',
//         senderId: 1
//       },
//       {
//         message: 'It should be Bootstrap 5 compatible.',
//         time: 'Mon Dec 10 2018 07:45:55 GMT+0000 (GMT)',
//         senderId: 1
//       },
//       { message: 'Absolutely!', time: 'Mon Dec 10 2018 07:46:00 GMT+0000 (GMT)', senderId: 11 },
//       {
//         message: 'Modern admin is the responsive bootstrap 5 admin template.!',
//         time: 'Mon Dec 10 2018 07:46:05 GMT+0000 (GMT)',
//         senderId: 11
//       },
//       { message: 'Looks clean and fresh UI.', time: 'Mon Dec 10 2018 07:46:23 GMT+0000 (GMT)', senderId: 1 },
//       { message: "It's perfect for my next project.", time: 'Mon Dec 10 2018 07:46:33 GMT+0000 (GMT)', senderId: 1 },
//       { message: 'How can I purchase it?', time: 'Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)', senderId: 1 },
//       { message: 'Thanks, from ThemeForest.', time: 'Mon Dec 10 2018 07:46:53 GMT+0000 (GMT)', senderId: 11 },
//       { message: 'I will purchase it for sure. 👍', time: '2020-12-08T13:52:38.013Z', senderId: 1 }
//     ]
//   },
//   contact: {
//     id: 1,
//     fullName: 'Felecia Rower',
//     avatar: require('@src/assets/images/portrait/small/avatar-s-20.jpg').default,
//     status: 'away'
//   }
// }

const CardChat = ({ messages, flowId }) => {

  const initialChatData = {
    chat: [],
    contact: {
      id: 1,
      fullName: 'Felecia Rower',
      avatar: require('@src/assets/images/portrait/small/avatar-s-20.jpg').default,
      status: 'away'
    }
  }

  // ** States
  const [msg, setMsg] = useState('')
  const [chatRef, setChatRef] = useState(null)
  const [chatData, setChatData] = useState(initialChatData)
  const authStore = useSelector(state => state.auth)
  const room = JSON.parse(localStorage.getItem("room"))
  console.log("Auth", authStore)

  useEffect(() => {
    const newMsg = { ...chatData }
    messages.map(msg => {
      newMsg.chat.push({
        message: msg.content,
        time: new Date(),
        senderId: msg.from._id
      })
    })

    setChatData(newMsg)
    setMsg('')
  }, [messages])

  //** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog = []
    if (chatData) {
      chatLog = chatData.chat
    }

    const formattedChatLog = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined
    let msgGroup = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg, index) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          msg: msg.message,
          time: msg.time
        })
      } else {
        chatMessageSenderId = msg.senderId
        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          messages: [
            {
              msg: msg.message,
              time: msg.time
            }
          ]
        }
      }
      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })
    return formattedChatLog
  }

  //** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item, index) => {
      return (
        <div
          key={index}
          className={classnames('chat', {
            'chat-left': authStore.userData !== {} && item.senderId === authStore.userData._id
          })}
        >
          <div className='chat-avatar'>
            <Avatar
              className='box-shadow-1 cursor-pointer'
              img={authStore.userData !== {} && item.senderId === authStore.userData._id ? profilePic : chatData.contact.avatar}
            />
          </div>

          <div className='chat-body'>
            {item.messages.map(chat => (
              <>
                <div key={chat.msg} className='chat-content'>
                  <p>{chat.msg}</p>
                </div>
              </>
            ))}
          </div>
        </div>
      )
    })
  }

  //** Scroll to chat bottom
  const scrollToBottom = () => {
    chatRef.scrollTop = Number.MAX_SAFE_INTEGER
  }

  useEffect(() => {
    if (chatRef !== null) {
      scrollToBottom()
    }
  }, [chatRef, chatData.chat.length])

  useEffect(() => {
    socket.on("sendMessage", data => {
      if (authStore.userData._id !== data.user._id) {
        const newMsg = { ...chatData }
        newMsg.chat.push({
          message: data.message,
          time: new Date(),
          senderId: data.user._id
        })
        setChatData(newMsg)
        setMsg('')
      }
    })
  }, [socket])


  const handleSendMsg = e => {
    e.preventDefault()
    if (msg.trim().length) {
      const newMsg = chatData
      newMsg.chat.push({
        message: msg,
        time: new Date(),
        senderId: authStore.userData._id
      })
      socket.emit('newMessage', { user: authStore.userData, room, message: msg, flowId })
      setChatData(newMsg)
      setMsg('')
    }
  }

  return (
    <Card className='chat-widget'>
      <CardHeader>
        <div className='d-flex align-items-center'>
          <Avatar color="light-secondary" style={{ borderRadius: "20%" }} status='online' content={authStore.userData.name ? authStore.userData.name : 'Demo Contact'} initials />
          <div className='user-info text-truncate ms-1'>
            <span className='d-block fw-bold text-truncate'>{authStore.userData.name ? authStore.userData.name : 'Demo Contact'}</span>
          </div>
        </div>
      </CardHeader>
      <div className='chat-app-window'>
        <PerfectScrollbar
          containerRef={el => setChatRef(el)}
          className='user-chats scroll-area'
          options={{ wheelPropagation: false }}
        >
          <div className='chats'>{renderChats()}</div>
        </PerfectScrollbar>
        <Form className='chat-app-form' onSubmit={e => handleSendMsg(e)}>
          <InputGroup className='input-group-merge me-1 form-send-message'>
            <InputGroupText>
              <Label className='attachment-icon mb-0' for='attach-doc'>
                <Image className='cursor-pointer text-secondary' size={14} />
                <input type='file' id='attach-doc' hidden />
              </Label>
            </InputGroupText>
            <Input
              value={msg}
              className='border-0'
              onChange={e => setMsg(e.target.value)}
              placeholder='Type your message'
            />
          </InputGroup>
          <Button className='send' color='primary'>
            <Send size={14} className='d-lg-none' />
            <span className='d-none d-lg-block'>Send</span>
          </Button>
        </Form>
      </div>
    </Card>
  )
}

export default CardChat
