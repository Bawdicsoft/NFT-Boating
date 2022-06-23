import React from 'react';
import { useState } from 'react';
// import { Avatar, IconButton, Modal } from '@material-ui/core'
import { useStateValue } from '../../StateProvider'
// import VideocamIcon from '@material-ui/icons/Videocam';
// import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
// import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
// import Modal from '@material-ui/icons/InsertEmoticon';
// import CloseIcon from '@material-ui/icons/Close';
// import axios from '../axios'
// import FormData from 'form-data'
import firebase,  {firestore}  from 'firebase'
import { db } from '../../firebase'
import { storage } from '../../firebase';

// import './MessageSender.css'



const MessageSender = () => {
    // const [{ user }, dispatch] = useStateValue()
    // const [open,setOpen] = useState(false)
    // const [progress, setProgress] = useState(0)
    // const [image, setImage] = useState("")
    const [eventTitle, seteventTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [eventWebsite, setEventWebsite] = useState("")
    const [marketURL, setMarketURL] = useState("")
    const [projectTwitter, setProjectTwitter] = useState("")
    const [projectDiscord, setProjectDiscord] = useState("")
    const [eventDate, setEventDate] = useState("")
    // const [eventBlockchain, setEventBlockchain] = useState("")
    // const [eventMarketplace, setEventMarketplace] = useState("")
    // const [eventTags, setEventTags] = useState("")

    // const handleClose =()=>{
    //     setOpen(false)
    // }


    // const uploadFileWithClick = () => {
    // }



    // const handleChange = (e) => {
    //     document.getElementById('imageFile').click()
    //     if (e.target.files[0]) {
    //         setImage(e.target.files[0])
    //     }
    // }

    const handleUpload = (e) => {
        e.preventDefault();
            db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                eventTitle: eventTitle,
                desc: desc,
                contactEmail: contactEmail,
                eventWebsite: eventWebsite,
                marketURL: marketURL,
                projectTwitter: projectTwitter,
                projectDiscord: projectDiscord,
                eventDate: eventDate,
                // eventBlockchain: eventBlockchain,
                // eventMarketplace:eventMarketplace,
                // eventTags:eventTags
            
        })
        // else {
        //     const uploadTask = storage.ref(`images/${image.name}`).put(image);

        //     uploadTask.on(
        //         "state_changed",
        //         (snapshot) => {
        //             const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) *
        //                 100);
        //             setProgress(progress)
        //         }, (error) => {
        //             console.log(error)
        //             alert(error.message)
        //         },
        //         () => {
        //             storage.ref("images").child(image.name).getDownloadURL().then(url => {
        //                 db.collection("posts").add({
        //                     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        //                     eventTitle: eventTitle,
        //                     desc: desc,
        //                     image: url,
        //                     contactEmail: contactEmail,
        //                     eventWebsite: eventWebsite,
        //                     marketURL: marketURL,
        //                     projectTwitter: projectTwitter,
        //                     projectDiscord: projectDiscord,
        //                     eventDate: eventDate,
        //                     eventBlockchain: eventBlockchain,
        //                     eventMarketplace:eventMarketplace,
        //                     eventTags:eventTags
        //                 })
        //             })
        //         })
        // }
        // handleClose();
        seteventTitle(null);
        setDesc(null);
        setContactEmail(null);
        // setImage(null);
        // setProgress(0)
    }

    // const handleOpen=()=>{
    //     setOpen(true)
    // }

    return (

        <>

            {/* <Modal open={open} onClose={handleClose}> */}
            <div className='modal_pop'>

                <form>
                    <div className='modalHeading'>
                        <h2>Create Post</h2>
                        {/* <IconButton >
                            <CloseIcon />
                        </IconButton> */}
                    </div>

                    <div className='modalHeader_top'>
                        {/* <Avatar /> */}
                        <h5>Farooqi</h5>
                    </div>
                    name
                    <input type='text' onChange={e => seteventTitle(e.target.value)} />

                    <div >
                        Desc:
                        <textarea rows='5' onChange={e => setDesc(e.target.value)} placeholder='Event Description?' ></textarea>
                    </div>


                    <div className=''>

                        {/* Picture <input type='file' id='imageFile' onChange={handleChange} /> */}

                    </div>

                    <div>
                        <input type='email' onChange={e => setContactEmail(e.target.value)} placeholder='email' />
                    </div>
                    <div>
                        Date:<input type='date' onChange={e => setEventDate(e.target.value)} placeholder='email' />
                    </div>
                    <div>
                        <input type='url' onChange={e => setEventWebsite(e.target.value)} placeholder='event website' />
                    </div>
                    <div>
                        <input type='url' onChange={e => setMarketURL(e.target.value)} placeholder='market url' />
                    </div>
                    <div>
                        <input type='url' onChange={e => setProjectTwitter(e.target.value)} placeholder='project twitter' />
                    </div>
                    <div>
                        <input type='url' onChange={e => setProjectDiscord(e.target.value)} placeholder='project discor' />
                    </div>
                    {/* <div>
                        <label>Blockchain:</label>
                        <select onChange={e => setEventBlockchain(e.target.value)} >
                            <option value=""></option>
                            <option value="Bitcoin">Bitcoin</option>
                            <option value="Ethereum">Ethereum</option>
                            <option value="VeChain">VeChain</option>
                            <option value="Fantom">Fantom</option>
                            <option value="WAX">WAX</option>
                        </select>
                    </div>

                    <div>
                        <label>Marketplace:</label>
                        <select className='form-select' onChange={e =>setEventMarketplace(e.target.value)} >
                            <option value="">OpenSea</option>
                            <option value="react">Magic Eden</option>
                            <option value="vue">Rarible</option>
                            <option value="angular">Minetable</option>
                            <option value="svelte">Makersplace</option>
                        </select>
                    </div>
                    <div>
                        <label>Categories(Tags):</label>
                        <select className='form-select' onChange={e =>setEventTags(e.target.value)}>
                            <option value="">Music</option>
                            <option value="react">Sports</option>
                            <option value="vue">Art</option>
                            <option value="angular">Game</option>
                            <option value="svelte">Metaverse</option>
                        </select>
                    </div> */}


                    {/* {image !== "" && <h2 style={{ "fontSize": "15px", "color": "green" }}> image added and will be upload soon </h2>}
                    {
                        progress !== "" && <progress val={progress} max="100%" style={{ "width": "100%" }} />
                    } */}

                    <input type='submit' onClick={handleUpload} className='post__submit' value='POST' />
                </form>
            </div>

            {/* </Modal> */}
            {/* <div className='messageSender'>
                <div className='messageSender__top'>
                    <Avatar />
                    <form>
                        <input type="text" placeholder='Whats on Your Mind' />
                    </form>
                </div>

                <div className='messageSender__bottom'>
                    <div className='messageSender__option'>
                        <VideocamIcon style={{ color: 'red' }} />
                        <h3>Live Video</h3>
                    </div>
                    <div className='messageSender__option'>
                        <PhotoLibraryIcon style={{ color: 'green' }} />
                        <h3>Photo/Video</h3>
                    </div>
                    <div className='messageSender__option'>
                        <InsertEmoticonIcon style={{ color: 'orange' }} />
                        <h3>Feeling/Activity</h3>
                    </div>
                </div>

            </div> */}
        </>
    );
};


export default MessageSender;
