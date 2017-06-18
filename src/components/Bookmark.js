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

  render() {
    let imageSrc = this.props.bookmark.imageURL ? this.props.bookmark.imageURL : require('../assets/imgph.png')

    return (
      <article className="dt w-100 bb b--black-05 pb2 mt2">
        <div className="dtc w2 w3-ns v-mid">
          <img src={imageSrc} role='presentation' className="ba b--black-10 db br2 w2 w3-ns h2 h3-ns" alt="" />
        </div>
        <a href={this.props.bookmark.url} className="dtc v-mid pl3">
          <h1 className="f6 f5-ns fw6 lh-title black mv0">{this.props.bookmark.title}</h1>
          <p className="f6 fw4 mt0 mb0 black-60">{this.props.bookmark.description}</p>
        </a>
        <div class="dtc v-mid">
          <div class="w-100 tr">
            <button className="f6 button-reset bg-white ba b--black-10 dim pointer pv1 black-60" onClick={this.handleDelete}>Delete</button>
          </div>
        </div>
      </article>
    )
  }




  handleDelete = async () => {
    await this.props.mutate({ variables: { id: this.props.bookmark.id } })

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
