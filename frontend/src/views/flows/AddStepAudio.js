// ** React Imports
import { Fragment } from 'react'

// ** ReactAudioRecorder Imports
import { useAudioRecorder } from '@sarafhbk/react-audio-recorder'

// ** Reactstrap Imports
import { Row, Col, Button, Input, Label } from 'reactstrap'

const AddStepAudio = ({ stepType, handleAddStep }) => {
  const {
    audioResult,
    timer,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    status,
    errorMessage
  } = useAudioRecorder()

  const handleSave = () => {
    console.log('audioResult', audioResult)
    if (audioResult) {
      handleAddStep(stepType, audioResult)
    }
  }

  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <div className='mb-2'>
            <audio controls src={audioResult} />
            <p>
              Status : <b>{status}</b>
            </p>
            <p>
              Error Message : <b>{errorMessage}</b>
            </p>
            <div>
              <p>{new Date(timer * 1000).toISOString().substr(11, 8)}</p>
              <div>
                <button onClick={startRecording}>Start</button>
                <button onClick={stopRecording}>Stop</button>
                <button onClick={pauseRecording}>Pause</button>
                <button onClick={resumeRecording}>Resume</button>
              </div>
            </div>
          </div>
          <div className='text-center'>
            <Button.Ripple className="primary-btn" color='primary' onClick={() => handleSave(content)}>
              Save and Add
            </Button.Ripple>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}

export default AddStepAudio
