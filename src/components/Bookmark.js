import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
// import { Link } from 'react-router'

class Bookmark extends React.Component {

  static propTypes = {
    bookmark: React.PropTypes.object,
    mutate: React.PropTypes.func,
    refresh: React.PropTypes.func,
  }

  render () {
    let imageSrc = this.props.bookmark.imageURL ? this.props.bookmark.imageURL : require('../assets/imgph.png')

    return (
      <article className="mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10">
        <a href={this.props.bookmark.url}>
          <div className="tc">
            <img src={imageSrc} role='presentation' className="br-100 h3 w3 dib" alt="" />
            <h1 className="f4">{this.props.bookmark.title}</h1>
            <hr className="mw3 bb bw1 b--black-10" />
          </div>
          <p className="lh-copy measure center f6 black-70">
            {this.props.bookmark.description}
          </p>
        </a>
        <span className="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-red" onClick={this.handleDelete}>Delete</span>
      </article>
    )
  }

  handleDelete = async () => {
    await this.props.mutate({variables: {id: this.props.bookmark.id}})

    this.props.refresh()
  }
}

const deleteMutation = gql`
  mutation deleteBookmark($id: ID!) {
    deleteBookmark(id: $id) {
      id
    }
  }
`

const bookmarkWithMutation = graphql(deleteMutation)(Bookmark)

export default bookmarkWithMutation
