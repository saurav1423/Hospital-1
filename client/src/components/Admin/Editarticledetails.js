import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import AdminNav from './AdminNav';

class Editarticledetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPicture: null,
            data: {
                title: '',
                location: '',
                ShortDescription: '',
                Video: '',
                profilePic: ''
            },
            error: {
                title: '',
                location: '',
                ShortDescription: '',
                video: '',
                profilePic: ''
            },
            success: '',
            loading: true,
        }
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePhotoChange = this.handlePhotoChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }


    handleUpdate(event) {
        event.preventDefault();

        let formData = new FormData();
        formData.append('title', this.state.data.title);
        formData.append('Location', this.state.data.location);
        formData.append('shortDescription', this.state.data.ShortDescription);
        formData.append('video', this.state.data.video);
        formData.append("profilePic", this.state.data.profilePic);

        axios.post(`http://localhost:8000/api/${this.props.match.params.id}/update`, formData)
            .then(res => {
                console.log('response update', res)
                if (res.data.errors) {
                    let mainErr = res.data.errors;
                    let errMsg = {
                        title: mainErr.title ? mainErr.title.msg : '',
                        location: mainErr.location ? mainErr.location.msg : '',
                        ShortDescription: mainErr.ShortDescription ? mainErr.ShortDescription.msg : ''
                    }
                    this.setState({
                        error: errMsg
                    });
                } else {
                    this.setState({

                        success: 'Student details updated successfully'
                    })
                }
            })
            .catch(error => console.log(error))

    }
    handleChange(element) {
        var formData = this.state.data;
        formData[element.target.name] = element.target.value;
        this.setState({
            data: formData
        })
    }

    handlePhotoChange(event) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            let file = event.target.files[0];

            var formData = this.state.data;
            formData[event.target.name] = event.target.files[0]

            reader.onloadend = () => {
                this.setState({
                    currentPicture: reader.result, // this is an image url
                    data: formData,
                });
            }

            reader.readAsDataURL(file)
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/api/update/${this.props.match.params.id}`)
        .then(function (response) {
            console.log(response.data);
            // _this.setState({data:response.data})
            if (response.data.error) {
                this.setState({ loading: false });
            } else {
                let newData = this.state.data;
                newData.title = response.data.title;
                newData.location = response.data.location;
                newData.ShortDescription = response.data.ShortDescription;
                newData.Video = response.data.Video;

                this.setState({
                    data: newData,
                    currentPicture: `http://localhost:8000/uploads/${
                        response.data.profilePic
                        }`
                });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        axios.get('http://localhost:8000/api/isloggedin')
        .then((res) => {
            console.log(res);
            if (res.data.error) {
                this.setState({ loading: false })
            } else if (res.data.jobTitle === 'SuperAdmin' || res.data.jobTitle === 'Admin') {
                this.setState({ admin: res.data, loading: false })
            } else {
                window.location.href = "/adminwsq"
            }
        });

    }
    render() {

        return <div className="editStudentDetails">
            <AdminNav />
            <h3>Edit your message</h3>
            <form onSubmit={this.handleUpdate}>
                <div className="left-side">
                    <div className="form-group">
                        <label htmlFor="exampleInputtitle">Title</label>
                        <input type="text" name="title" value={this.state.data.title} onChange={this.handleChange} className="form-control" id="exampleInputtitle" placeholder="Title" />
                    </div>
                    <p className="text-danger">{this.state.error.title}</p>
                    <div className="form-group">
                        <label htmlFor="exampleInputLocation">Location</label>
                        <input type="text" name="location" value={this.state.data.location} onChange={this.handleChange} className="form-control" id="exampleInputLocation" placeholder="Location" />
                    </div>
                    <p className="text-danger">
                        {this.state.error.location}
                    </p>

                    <div className="form-group">
                        <label htmlFor="exampleInputShortDescription">
                            Short Description
                  </label>
                        <textarea rows="4" cols="50" type="text" name="ShortDescription" value={this.state.data.ShortDescription} onChange={this.handleChange} className="form-control" id="exampleInputShortDescription" placeholder="Description" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleInputtitle">Video</label>
                        <input type="text" name="Video" value={this.state.data.Video} onChange={this.handleChange} className="form-control" id="exampleInputtitle" placeholder="Video" />
                    </div>

                    <p className="text-danger">
                        {this.state.error.ShortDescription}
                    </p>
                </div>

                <div className="right-side">
                    <div className="form-group">
                        {this.state.currentPicture && <img src={this.state.currentPicture} width="100" height="100" />}
                        <label htmlFor="exampleInputPhoto">
                            Profile Photo
                  </label>
                        <input type="file" name="photo" accept="image/*" onChange={this.handlePhotoChange} className="form-control" id="exampleInputPhoto" placeholder="Photo" />
                    </div>
                    <p className="text-danger">
                        {this.state.error.profilePic}
                    </p>
                </div>
                <p className="text-success">{this.state.success}</p>
                <button type="submit" className="btn btn-primary submit">
                    Update
              </button>
            </form>
        </div>;
    }
}

export default Editarticledetails;
