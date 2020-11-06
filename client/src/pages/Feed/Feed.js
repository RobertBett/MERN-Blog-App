import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';

class Feed extends Component {
  state = {
    openModal: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false,
    isEditing:false
  };

  componentDidMount() {
    axios.get('URL')
      .then(res => {
        console.log(res)
        if (res.status !== 200) {
          throw new Error('Failed to fetch user status.');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData)
        this.setState({ status: resData.status });
      })
      .catch( err =>{
        console.error(err,'IS THIS A PROBLEM');
        // this.catchError(err)
      });

    this.loadPosts();
  }

  loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }
    axios.get(`http://localhost:8080/feed/posts?page=${page}`)
      .then(({data}) => {
        console.log(data, 'WHATS IN THIS ');
        this.setState({
          posts: data.posts,
          totalPosts: data.totalItems,
          postsLoading: false
        });
      })
      .catch(err =>{
        this.catchError(err)
      });
  };

  statusUpdateHandler = event => {
    event.preventDefault();
    fetch('URL')
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ openModal: true });
  };

  startEditPostHandler = postId => {
      this.setState(prevState => {
        const loadedPost = { ...prevState.posts.find(p => p._id === postId) };

        return {
          openModal: true,
          isEditing:true,
          editPost: loadedPost,
          postId
        };
      });
  };

  cancelEditHandler = () => {
      this.setState({ openModal: false, editPost: null, isEditing:false });
    };

  finishEditHandler = postData => {
      const { title, content, image } = postData;
      this.setState({
        editLoading: true
      });

      // Set up data (with image!)
      let formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('image', image);

      for (var key of formData.entries()) {
        console.log(key[0] + ', ' + key[1])
      }
      const { openModal, isEditing,postId } = this.state; 

      axios({
          method: openModal && isEditing ?'put' : 'post',
          url: openModal && isEditing ? 
          `http://localhost:8080/edit-post/${postId}`
          :'http://localhost:8080/post',
          data: formData,
          headers: {'Content-Type': 'multipart/form-data' }
        })
        .then((result) => {
          if(openModal && isEditing )return axios.get(`http://localhost:8080/feed/post/${postId}`);
          return result;
        })
        .then(({ data }) => {
          console.log(data,'THIS SHOULD WORK');
          const { _id, title, content, creator, createdAt, imageUrl} = data.post;
          const post = {
            _id,
            title,
            imageUrl,
            content,
            creator,
            createdAt,
          };
          this.setState(prevState => {
            let updatedPosts = [...prevState.posts];
            if (openModal && isEditing) {
              const postIndex = prevState.posts.findIndex(
                p => p._id === prevState.editPost._id
              );
                updatedPosts[postIndex] = post;
              } else{
                updatedPosts = [post, ...prevState.posts];
              }
            console.log(updatedPosts,'DOES UNSHIFT WORK??');
            return {
              posts: updatedPosts,
              openModal: false,
              editPost: null,
              editLoading: false,
              isEditing: false
            };
          });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            openModal: false,
            editPost: null,
            editLoading: false,
            isEditing: false
          })
      });

  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = postId => {
    this.setState({ postsLoading: true });
    axios.delete(`http://localhost:8080/delete-post/${postId}`)
      .then(() => {
        this.setState(prevState => {
          const updatedPosts = prevState.posts.filter(p => p._id !== postId);
          return { posts: updatedPosts, postsLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.openModal}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'previous')}
              onNext={this.loadPosts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map(post => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
