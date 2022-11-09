// ** React Imports
import { selectThemeColors } from '@utils'
import axios from "axios"
import { Fragment, useState } from 'react'
import Select from 'react-select'

// ** Reactstrap Imports
import { Button, Card, CardBody, Col, Label, ListGroup, ListGroupItem, Row } from 'reactstrap'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { DownloadCloud, FileText, X } from 'react-feather'

const AddStepFile = ({ stepType, handleAddStep }) => {
  // ** State
  const [files, setFiles] = useState([])
  const [invalid, setInvalid] = useState(false)

  // useEffect(() => {
  //   axios.get(`steps/usedLinks/File`)
  //     .then(res => {
  //       console.log("||||||||", res)
  //       const data = []
  //       res.data.step.map((item => {
  //         data.push({
  //           value: item.content,
  //           label: item.content
  //         })
  //       }))
  //       setFiles(data)
  //       console.log("#@", data)
  //     })
  //     .catch(error => {
  //       console.log('error:', error)
  //     })
  // }, [])

  const colourOptions = [
    { value: 'ocean', label: 'Ocean' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' }
  ]

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
    } else {
      return <FileText size='28' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  const handleSave = files => {
    if (files.length) {
      if (files[0].size < 20024207) {
        console.log("dfdfdfd", files[0])

        const reader = new FileReader()
        reader.onload = function (e) {
          console.log("event", e)
          const options = {
            method: 'PUT',
            url: `https://storage.bunnycdn.com/btw-storage-main/files/${files[0].name}`,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': "true",
              Accept: "*/*",
              'Access-Control-Allow-Methods': "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept, Authorization",
              AccessKey: '9cd774e3-fbf1-4dce-a9f268f6d6c1-30f1-4ce5',
              'Content-Type': 'application/octet-stream'
            },
            data: reader.result
          }

          axios.request(options)
            .then(res => {
              console.log("^^^^^^^^^", res)
            })
            .catch(err => {
              console.log('sdssssssss', err)
            })
          // binary data
          console.log('onload:', reader.result)

          // console.log('onload', e.target.result)
        }
        reader.onerror = function (e) {
          // error occurred
          console.log('Error : ', e.type)
        }
        console.log('file', files[0])
        reader.readAsDataURL(files[0])

        handleAddStep(stepType, files[0].name)
        setFiles([])
        setInvalid(false)
      }
    } else {
      setInvalid(true)
    }
  }

  const fileList = files.map((file, index) => (
    <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file.name}</p>
          <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
        <X size={14} />
      </Button>
    </ListGroupItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Fragment>
      <Row className='px-5'>
        <Col sm='6'>
          <Card>
            <CardBody>
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <div className='d-flex align-items-center justify-content-center flex-column'>
                  <DownloadCloud size={64} />
                  <h5>Drop Files here or click to upload</h5>
                  <p className='text-secondary'>
                    Drop files here or click{' '}
                    <a href='/' onClick={e => e.preventDefault()}>
                      browse
                    </a>{' '}
                    thorough your machine
                  </p>
                </div>
              </div>
              {files.length ? (
                <Fragment>
                  <ListGroup className='my-2'>{fileList}</ListGroup>
                </Fragment>
              ) : null}
            </CardBody>
          </Card >
          {!files.length && invalid && <small className='text-danger'>{'You have to upload file!'}</small>}
          {files.length && files[0].size > 20024207 && <small className='text-danger'>{'Max size is 20mb. For larger files, please upload elsewhere and insert a URL link for it'}</small>}
          <div className='mt-2 text-center'>
            <Button.Ripple color='primary' className="primary-btn me-2" outline onClick={handleRemoveAllFiles}>
              Cancel
            </Button.Ripple>
            <Button.Ripple color='primary' className="primary-btn" onClick={() => handleSave(files)}>
              Save and Add
            </Button.Ripple>
          </div>
        </Col>
        <Col sm='6'>
          <div className=''>
            <Label className='form-label' for='content'>
              Copy from recently used
            </Label>
          </div>
          <div className='text-left'>
            <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue={colourOptions[0]}
              options={colourOptions}
              isClearable={false}
            />
          </div>
        </Col>
      </Row>
    </Fragment >
  )
}

export default AddStepFile
