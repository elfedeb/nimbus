import React from 'react'
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import validator from 'validator'
import 'isomorphic-fetch'

class CreateBookmark extends React.Component {

  static propTypes = {
    router: React.PropTypes.object,
    addBookmark: React.PropTypes.func,
    refresh: React.PropTypes.func,
  }
  constructor(props) {
    super(props)
    this.state = {
      pending: true,
      url: '',
      title: '',
      host: '',
      imageURL: '',
      description: ''
    }
  }

  render() {
    // Set text as the state of the input
    const url = this.state.url
    // Change the background of the input if the URI is invalid 
    const style = {
      input:
      { backgroundColor: url.length > 0 ? (validator.isURL(url) ? '#fff' : '#f2dede') : null }
    }
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }
    return (
      <div className='pa4 flex justify-center bg-white'>
        <div style={{ maxWidth: 400 }} className=''>

          <input
            className='w-100 pa3 mv2'
            style={style.input}
            value={this.state.url}
            placeholder='Paste a link and hit enter'
            onChange={(e) => this.setState({ url: e.target.value })}
          />
          {url &&
            <button
              disabled={url.length > 0 ? (validator.isURL(url) ? '' : 'disabled') : null}
              className='pa3 bg-black-10 bn dim ttu pointer'
              onClick={this.handleBookmark}>Bookmark</button>
          }

        </div>
      </div>
    )
  }

  handleBookmark = async () => {
    const { url } = this.state
    console.log('This is the URL: ' + url)
    // Check if its a URL
    if (!validator.isURL(url)) { return }
    console.log('Starting to fectch from the server')
    let that = this;

    // Go fetch: sends the validated URL to the server and waits for the scraped info
    // *linkData* has the scraped info: 
    // url: The URL
    // title: The sanitized title
    // host: Hostname of the page (like, markupvalidator.com, without the scheme)
    // imageURL: Most relevant image, if defined with og:image
    // description: description from meta tag
    // ogTitle : opengraph title
    // ogDescription : opengraph description

    fetch('//localhost:3014/links/', {
      method: 'post',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url })
    })
      // When the fetch is ready check the response or throw an error
      .then( function(response) {
        if (response.status >= 400) {
          // throw new Error('Bad response from the server')
          console.log('Mr. Server is not happy. Please try again later.')
        }
        return response.json()
      })
      // If everything is OK save.
      .then( function(linkData) {
        console.log('Saving on GraphCool')
        const { url, title, host, imageURL, description } = linkData
        that.props.addBookmark({
          variables: {
            url,
            title,
            host,
            imageURL,
            description
          }
        })
        console.log('... Saved link with this title: ' + title)
        // phew... after all that go ahead an clean the text field
        that.setState({ url: '' })
        that.props.refresh()

      }
      )
  }
}

const addMutation = gql`
  mutation addBookmark($url: String!, $title: String, $host: String!, $imageURL: String, $description: String) {
    createBookmark(
        url: $url
        title: $title
        host: $host
        imageURL: $imageURL
        description: $description
        ) {
          id
          url
          title
          host
          imageURL
          description
    }
  }
`

const PageWithMutation = graphql(addMutation, { name: 'addBookmark' })(CreateBookmark)

export default withRouter(PageWithMutation)