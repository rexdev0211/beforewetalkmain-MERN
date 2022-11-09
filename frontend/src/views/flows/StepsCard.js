// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Card, Button, CardBody, Row, Col } from 'reactstrap'

// ** Icons Imports
const audioIcon = require('@src/assets/images/icons/custom/audio.svg').default
const videoIcon = require('@src/assets/images/icons/custom/video.svg').default
const textIcon = require('@src/assets/images/icons/custom/text.svg').default
const urlIcon = require('@src/assets/images/icons/custom/url.svg').default
const fileIcon = require('@src/assets/images/icons/custom/file.svg').default
const xIcon = require('@src/assets/images/icons/custom/x.svg').default

const StepsCard = ({ steps, handleRemoveStep }) => {
  const getIconByStepType = (type) => {
    switch (type) {
      case 'Text':
        return textIcon
      case 'Video':
        return videoIcon
      case 'Audio':
        return audioIcon
      case 'URL':
        return urlIcon
      case 'File':
        return fileIcon
      default:
        return ''
    }
  }

  const getContentByStepType = (type, content) => {
    switch (type) {
      case 'Text':
        return content
      case 'Video':
        return videoIcon
      case 'Audio':
        const file = new File([content], "1.wav")
        console.log('file', file)
        return file.name
      case 'URL':
        return content
      case 'File':
        return content
      default:
        return ''
    }
  }

  return (
    <Fragment>
      {steps.length > 0 && (
        <Card>
          <CardBody>
            {steps.map((item, i) => (
              <Row key={i} className='mx-1 my-1 py-1 px-1' style={{ border: '1px dashed #E8E7F7' }}>
                <Col sm='2'>
                  <div>
                    <h4>{`Step ${i + 1}`}</h4>
                  </div>
                </Col>
                <Col sm='10' className='py-2 px-2' style={{ border: '1px solid #E8E7F7' }}>
                  <div className='d-flex justify-content-between mb-2'>
                    <div className='d-flex align-items-center'>
                      <img src={getIconByStepType(item.stepType)} />
                      <div className='mx-1'>
                        <h3 className='mb-0'>{item.stepType}</h3>
                      </div>
                    </div>
                    <Button.Ripple className='btn-icon rounded-circle custom-icon-btn' color='flat-secondary' size='sm' onClick={() => handleRemoveStep(i)}>
                      <img src={xIcon} />
                    </Button.Ripple>
                  </div>
                  <div>
                    <h5 style={{ lineHeight: 1.5 }}>{getContentByStepType(item.stepType, item.content)}</h5>
                  </div>
                </Col>
              </Row>
            ))}
          </CardBody>
        </Card>
      )}
    </Fragment>
  )
}

export default StepsCard
