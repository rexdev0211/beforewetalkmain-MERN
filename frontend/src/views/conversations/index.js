// ** React Imports
import Avatar from '@components/avatar'
import axios from "axios"
import classnames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { Search } from 'react-feather'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { socket } from '../../utils/helper'
import CardChat from './CardChat'

// ** Third Party Components
import {
  Card, Col, Input, InputGroup, InputGroupText, ListGroup, ListGroupItem, Nav, NavItem, NavLink, Row, TabContent, TabPane
} from 'reactstrap'

const audioIcon = require('@src/assets/images/icons/custom/audio.svg').default
const videoIcon = require('@src/assets/images/icons/custom/video.svg').default
const fileIcon = require('@src/assets/images/icons/custom/file.svg').default

import AddStepAudio from '../flows/AddStepAudio'
import AddStepFile from '../flows/AddStepFile'
import AddStepVideo from '../flows/AddStepVideo'

const Conversations = () => {
  // ** States
  // const [activeTab, setActiveTab] = useState('1')
  // const [data, setData] = useState(null)
  const stepTypes = [
    {
      id: 1,
      title: 'Audio',
      icon: audioIcon,
      content: <AddStepAudio stepType={'Audio'} />
    },
    {
      id: 2,
      title: 'Video',
      icon: videoIcon,
      content: <AddStepVideo stepType={'Video'} />
    },
    {
      id: 3,
      title: 'File',
      icon: fileIcon,
      content: <AddStepFile stepType={'File'} />
    }
  ]

  const [messages, setMessages] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [active, setActive] = useState(1)
  const [rooms, setRooms] = useState([])
  const authStore = useSelector(state => state.auth)
  const [activeRoom, setActiveRoom] = useState('')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  const params = useParams()

  socket.on("UserJoined", data => {
    console.log("UserJoined", data)
    if (authStore.userData._id === data.room.creator) {
      localStorage.setItem("room", JSON.stringify(data.room))
      socket.emit('JoinRoom', { room: data, user: authStore.userData })
    }
  })

  useEffect(() => {
    //creating the room
    if (params.flowId) {
      axios
        .put(`rooms/update/${params.flowId}`)
        .then(res => {
          console.log("CONSOLE", res.data.room.creator)
          localStorage.setItem("room", JSON.stringify(res.data.room))
          socket.emit('JoinRoom', { room: res.data.room, user: authStore.userData })
          axios.get(`rooms`)
            .then(res => {
              console.log("Rooms", res)
              setRooms(res.data.rooms)
              setActiveRoom(res.data.rooms[0]._id)
            })
            .catch(error => {
              console.log('error:', error)
            })
          axios
            .get(`messages/getByFlowId/${params.flowId}`)
            .then(res => {
              console.log("Get messages", res)
              setMessages(res.data.messages)
            })
        })
    }

    axios.get(`rooms`)
      .then(res => {
        console.log("||||||||", res)
        setActiveRoom(res.data.rooms[0].flow_id)
        setRooms(res.data.rooms)
      })
      .catch(error => {
        console.log('error:', error)
      })


  }, [])

  const handleFilter = e => {
    setSearchValue(e.target.value)
  }

  // const changeRoom = e => {
  //   console.log("changeRoom", e)
  // }

  const toggleRoom = room => {
    if (activeRoom !== room._id) {
      setActiveRoom(room._id)
      axios
        .get(`messages/getByFlowId/${room.flow_id}`)
        .then(res => {
          console.log("Get messages", res)
          setMessages(res.data.messages)
        })
    }
  }

  return (
    <Fragment>
      <h1 className='display-3 mb-2'>Your conversations</h1>
      <h3 className='mb-2'>Your contacts and conversations live here. Share your flow to get more conversations</h3>
      <Row>
        <Col sm='4'>
          {rooms.length !== 0 && (
            <>
              <InputGroup className='input-group-merge mb-2'>
                <Input
                  placeholder='Search Flow...'
                  className='dataTable-filter'
                  type='text'
                  bsSize='sm'
                  id='search-input'
                  value={searchValue}
                  onChange={handleFilter}
                />
                <InputGroupText>
                  <Search size={20} />
                </InputGroupText>
              </InputGroup>
              <Card className='mb-4' style={{ height: "300px", overflowY: "auto" }}>
                <ListGroup flush>
                  {rooms.filter(room => room.invited_user && room.invited_user.name.toLowerCase().includes(searchValue)).map(room => (
                    <ListGroupItem
                      className={classnames('cursor-pointer', {
                        active: activeRoom === room._id
                      })}
                      onClick={() => toggleRoom(room)}
                      action >
                      <div className='d-flex align-items-center'>
                        <Avatar color={activeRoom === room._id ? 'secondary' : 'light-secondary'} style={{ borderRadius: "20%" }} status='online' content={room.creator._id === authStore.userData._id ? room.invited_user.name : room.creator.name} initials />
                        <div className='user-info text-truncate ms-1'>
                          <span className='d-block fw-bold text-truncate'>{room.creator._id === authStore.userData._id ? room.invited_user.name : room.creator.name}</span>
                        </div>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Card>
            </>
          )}
          {rooms.length === 0 && (
            <div className='d-flex align-items-center'>
              <Avatar color="light-secondary" style={{ borderRadius: "20%" }} status='online' content="Demo Contact" initials />
              <div className='user-info text-truncate ms-1'>
                <span className='d-block fw-bold text-truncate'>Demo Contact</span>
              </div>
            </div>
          )}
        </Col>
        <Col sm='8'>
          <CardChat messages={messages} flowId={params.flowId} />
          {rooms.length !== 0 && (
            <div className='mb-3'>
              <Nav tabs justified>
                {stepTypes.map(item => (
                  <NavItem key={item.id}>
                    <NavLink
                      active={active === item.id}
                      onClick={() => {
                        toggle(item.id)
                      }}
                    >
                      <img src={item.icon} />
                      <span className='align-middle mx-1'>{item.title}</span>
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
              <TabContent className='py-50' activeTab={active}>
                {stepTypes.map(item => (
                  <TabPane tabId={item.id} key={item.id}>
                    {item.content}
                  </TabPane>
                ))}
              </TabContent>
            </div>

          )}
        </Col>
      </Row>
    </Fragment >
  )
}

export default Conversations
