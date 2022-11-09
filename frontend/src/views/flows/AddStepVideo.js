// ** React Imports
import { Fragment, useState } from 'react'

// ** ReactVideoRecorder Imports
import VideoRecorder from 'react-video-recorder'

// ** Reactstrap Imports
import { Row, Col, Button, Input, Label } from 'reactstrap'

const AddStepVideo = ({ stepType, handleAddStep }) => {
  // ** State
  const [videoResult, setVideoResult] = useState(null)

  const handleSave = () => {
    console.log('videoResult', videoResult)
    if (videoResult) {
      handleAddStep(stepType, videoResult)
    }
  }

  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <div className='mb-2'>
            <VideoRecorder
              onRecordingComplete={(videoBlob) => {
                // Do something with the video...
                console.log('videoBlob', videoBlob)
                setVideoResult(videoBlob)
              }}
            />
          </div>
          <div className='text-center'>
            <Button.Ripple className="primary-btn" color='primary' onClick={() => handleSave()}>
              Save and Add
            </Button.Ripple>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}

export default AddStepVideo
