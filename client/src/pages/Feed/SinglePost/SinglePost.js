import axios from 'axios';
import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    console.log(typeof postId);
    const graphqlQuery ={
      query:`
      {
        post(postId:"${postId}") {
            title
            content
            imageUrl
            creator{
              userName
            }
            createdAt
          }
      }
      `
    }
    axios({
      method:'post',
      url:`http://localhost:8080/graphql`,
      data:{...graphqlQuery},
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.token}`
       }
    })
      .then(({ data }) => {
        console.log(data, 'THE LAST THING');
        const {title, creator,imageUrl,createdAt,content } = data.data.post
        this.setState({
          title,
          author:creator.userName,
          image: imageUrl,
          date: new Date(createdAt).toLocaleDateString('en-US'),
          content: content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image imageUrl={`http://localhost:8080/${this.state.image}`} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
