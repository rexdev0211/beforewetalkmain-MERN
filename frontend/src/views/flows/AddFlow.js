// ** React Imports
import axios from "axios"
import { Fragment, useEffect, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Link, X } from "react-feather"
import toast from "react-hot-toast"
import { useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Button,
  Card,
  CardBody,
  Col, FormFeedback, Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PopoverHeader,
  Row,
  UncontrolledPopover
} from "reactstrap"


const trashIcon = require("@src/assets/images/icons/custom/trash.svg").default
const hintIcon = require("@src/assets/images/icons/custom/hint.svg").default

const AddFlow = ({ flow, handleCreateFlow, handleUpdateFlow, handleDeleteFlow }) => {
  const [showBtn, setShowBtn] = useState(false)
  const [flowName, setFlowName] = useState("")
  const [flowLink, setFlowLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [valid, setValid] = useState(true)
  const [logged, setLogged] = useState(false)
  const [centeredModal, setCenteredModal] = useState(false)
  const authStore = useSelector(state => state.auth)

  useEffect(() => {
    if (authStore.userData.name) {
      console.log('MAXIMUS', authStore?.userData)
      setLogged(true)
      // setName(authStore?.userData?.name || authStore?.userData?.fullName)
    }
  }, [authStore])

  useEffect(() => {
    if (flow._id !== "") {
      setFlowLink(`${process.env.REACT_APP_BASENAME}/conversations/${flow._id}`)
    }
    if (flow.name !== '') {
      setFlowName(flow.name)
    }
    if (flow.link !== '') {
      setFlowLink(flow.link)
      setShowBtn(true)
    }
  }, [flow])

  const handleSave = () => {
    if (logged) {
      axios
        .get(`/flows/checkFlow/${flowName}`)
        .then((res) => {
          console.log("Check duplicated flow", res)
          if (res.data.flow.length === 0 && flowName !== "") {
            handleCreateFlow(flowName, flowLink)
            setShowBtn(true)
          } else {
            setValid(false)
            toast.error("The flow already exists!")
          }
        })
    } else {
      toast.error("You have to log In!")
    }
  }

  const onCopy = () => {
    setCopied(true)
    console.log("Copyed", copied)
    toast.success("Copied To Clipboard !")
  }

  const deleteFlow = () => {
    setCenteredModal(!centeredModal)
    handleDeleteFlow(flow._id)
  }

  return (
    <Fragment>
      <Card>
        <CardBody>
          <Row className="px-1 py-1 ">
            <Col sm="5">
              <Label
                className={showBtn ? "form-label mt-1" : "form-label"}
                for="flowName"
              >
                Flow Name
              </Label>
              <Input
                type="text"
                id="flowName"
                placeholder="Demo Flow"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                invalid={flowName === '' && !valid}
              />
              <FormFeedback>Oh no! That name is already taken.</FormFeedback>

              {showBtn && (
                <>
                  <Button.Ripple
                    className="px-0 py-0 me-2 mt-2"
                    onClick={() => setCenteredModal(!centeredModal)}
                  >
                    <img src={trashIcon} />
                  </Button.Ripple>
                  <Button.Ripple
                    color="primary"
                    className="primary-btn mt-2"
                    onClick={() => handleUpdateFlow(flow._id, flowName, flowLink)}
                  >
                    Save Changes
                  </Button.Ripple>
                </>
              )}
            </Col>
            <Col sm="7">
              {!showBtn && (
                <Button.Ripple
                  color="primary"
                  className="primary-btn mt-2"
                  onClick={() => handleSave()}
                >
                  Save flow and get URL link
                </Button.Ripple>
              )}
              {showBtn && (
                <>
                  <Label className="form-label" for="flowName">
                    URL to share this flow
                  </Label>
                  <Button.Ripple
                    className="btn-icon rounded-circle px-0 py-0 mb-2"
                    color="flat-success"
                    id="popBottom"
                  >
                    <img src={hintIcon} />
                  </Button.Ripple>
                  <div className="d-flex" style={{ alignItems: "center" }}>
                    <Link size={20} style={{ color: "#6258cc" }} />
                    <h5
                      className="me-2"
                      style={{ marginBottom: "0px", marginLeft: "16px" }}
                    >
                      {flowLink}
                    </h5>
                    <CopyToClipboard
                      onCopy={onCopy}
                      text={flowLink}
                    >
                      <Button.Ripple color="primary" className="primary-btn">
                        Copy Link
                      </Button.Ripple>
                    </CopyToClipboard>
                  </div>
                  <UncontrolledPopover placement="bottom" target="popBottom">
                    <PopoverHeader
                      style={{ width: "500px", backgroundColor: "white" }}
                      className="d-flex"
                    >
                      <Col sm="1">
                        <img src={hintIcon} />
                      </Col>
                      <Col sm="10" style={{ color: "#5e5873" }}>
                        Share this URL link to let recipients view your
                        messages. Each recipient can then start a private 1-1
                        conversation with you to learn more. Consider adding
                        this link to your email and other outbound
                        communications to enable more recipients to engage with
                        you.
                      </Col>
                      <Col sm="1">
                        <X size={15} style={{ color: "#5e5873" }} />
                      </Col>
                    </PopoverHeader>
                  </UncontrolledPopover>
                  <div className="vertically-centered-modal">
                    <Modal
                      isOpen={centeredModal}
                      toggle={() => setCenteredModal(!centeredModal)}
                      className="modal-dialog-centered"
                      style={{ width: "350px" }}
                    >
                      <ModalHeader
                        toggle={() => setCenteredModal(!centeredModal)}
                      ></ModalHeader>
                      <ModalBody className="d-flex justify-content-center">
                        <img
                          className="me-2"
                          src={hintIcon}
                          style={{ width: "30px" }}
                        />
                        <h5 style={{ marginTop: "10px" }}>
                          Confirm deleting this flow
                        </h5>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="primary"
                          onClick={() => deleteFlow()}
                        >
                          Yes
                        </Button>{" "}
                        <Button
                          color="flat-primary"
                          style={{ backgroundColor: "#E8E7F7" }}
                          onClick={() => setCenteredModal(!centeredModal)}
                        >
                          Cancel
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                  </div>
                </>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default AddFlow
