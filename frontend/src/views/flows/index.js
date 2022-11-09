// ** React Imports
import { Fragment, useEffect, useState } from "react"
// import { useParams } from 'react-router-dom'

// ** Third Party Components
import axios from "axios"
// import { useDispatch } from 'react-redux'

// ** Reactstrap Imports
import toast from "react-hot-toast"
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from "reactstrap"

// ** Actions
// import { handleLogin } from '@store/authentication'

// ** Components
import AddFlow from "./AddFlow"
import AddStep from "./AddStep"
import StepsCard from "./StepsCard"
// import ModalSuccess from './ModalSuccess'
// import ModalFailed from './ModalFailed'

// ** Styles
import "@styles/base/pages/flows.scss"

const initialSteps = [
  {
    content:
      "Welcome to Before We Talk! BWT helps increase engagement from people outside your network while saving you time in meetings.",
    description: "",
    stepType: "Text"
  },
  {
    content:
      "Click Add Step to create your own conversation flow. You can record video and audio messages (and then re-use them) to easily create personalized messaging. Once saved, share the URL link (e.g. include in your emails) to anyone you'd like to reach. Recipients can view it and respond (also with audio and video) to start a private conversation with you. All without the need to schedule a meeting first.",
    description: "",
    stepType: "Text"
  }
]

const initialFlow = {
  _id: "",
  link: "",
  name: ""
}

const Flows = () => {
  // ** Hooks
  // const dispatch = useDispatch()

  // ** States
  // const [successModal, setSuccessModal] = useState(false)
  // const [failedModal, setFailedModal] = useState(false)
  const [addStepMode, setAddStepMode] = useState(false)
  const [steps, setSteps] = useState(initialSteps)
  const [flow, setFlow] = useState(initialFlow)
  const authStore = useSelector(state => state.auth)
  // ** Vars
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (params.flowId) {
      axios.get(`flows/${params.flowId}`)
        .then(res => {
          const data = res.data.flow
          setFlow({
            _id: data._id,
            link: data.link,
            name: data.name
          })
          console.log("PaRAMS", res)
          axios.get(`steps/getByFlowId/${params.flowId}`)
            .then(res => {
              console.log("EEEEEEEE", res)
              setSteps(res.data.steps)
            })
        })
        .catch(error => {
          console.log('error:', error)
        })
    }
  }, [params.flowId])

  const handleAddStep = (stepType, content, description = "") => {
    console.log("stepType:", stepType)
    console.log("content:", content)
    console.log("description:", description)
    const newSteps = [...steps]
    newSteps[newSteps.length] = {
      stepType,
      content,
      description
    }
    setSteps(newSteps)
    toast.success("Step is added successfully!")
  }

  const handleRemoveStep = (index) => {
    console.log("index", index)
    const newSteps = [...steps]
    newSteps.splice(index, 1)
    setSteps(newSteps)
  }

  const handleCreateFlow = (flowName, flowLink = "") => {
    axios
      .post('/flows/create', { name: flowName, link: flowLink })
      .then((res) => {
        toast.success("Flow is created successfully!")
        console.log("Flow create res", res)
        setFlow(res.data.new_flow)
      })
      .catch((err) => {
        console.log("Error", err)
      })
  }

  const handleUpdateFlow = async (flowId, flowName, flowLink = "") => {

    // await 
    await axios.put(`/flows/update/${flowId}`, { name: flowName, link: flowLink })

    const stepArray = steps.map((step, index) => {
      return {
        flow: flowId,
        stepNumber: index + 1,
        stepType: step.stepType,
        content: step.content,
        description: step.description
      }
    })
    await axios.post('/steps/create', stepArray)


    const res = await axios.post('rooms/create', { flowId })
    console.log("Room res", res)

    const messageArray = steps.map((step) => {
      return {
        room: res.data.room,
        user: authStore.userData._id,
        message: step.content,
        flowId
      }
    })
    const result = await axios.post('messages/create', messageArray)
    console.log("message result", result)

    toast.success("Flow and steps are created successfully!")
  }

  const handleDeleteFlow = (flowId) => {
    axios
      .delete(`/flows/delete/${flowId}`)
      .then((res) => {
        console.log("res", res)
        toast.success("Flow is deleted successfully!")
        setFlow(initialFlow)
        setSteps([])
        navigate("/flows")
      })
      .catch((err) => {
        console.log("Error", err)
      })
  }

  return (
    <Fragment>
      <h1 className="display-4 mb-2">
        Let’s create
        <br /> a conversation flow to
        <br /> save time in meetings
      </h1>
      <h4 className="mb-2">
        Add 1 or more steps below to create a shareable conversation flow.{" "}
      </h4>
      <Button.Ripple
        color="primary"
        className="primary-btn mb-5"
        onClick={() => setAddStepMode(true)}
      >
        Add step
      </Button.Ripple>

      {addStepMode && <AddStep handleAddStep={handleAddStep} />}

      <StepsCard steps={steps} handleRemoveStep={handleRemoveStep} />

      <AddFlow flow={flow} handleCreateFlow={handleCreateFlow} handleUpdateFlow={handleUpdateFlow} handleDeleteFlow={handleDeleteFlow} />
      {/* 
      <ModalSuccess successModal={successModal} setSuccessModal={setSuccessModal} handleSaveName={handleSaveName} />

      <ModalFailed failedModal={failedModal} setFailedModal={setFailedModal} />
       */}
    </Fragment>
  )
}

export default Flows
