import React from 'react'
import CreateBookmark from '../components/CreateBookmark'
import Bookmark from '../components/Bookmark'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class ListPage extends React.Component {

  static propTypes = {
    data: React.PropTypes.object,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.data.refetch()
    }
  }

  render() {
    if (this.props.data.loading) {
      return (<div className='flex w-100 h-100 items-center justify-center pt7'>
        <div>Loading... </div>
      </div>)
    }

    return (
      <div className={'w-100 flex justify-center'}>
        <div className='w-100 flex flex-wrap' style={{ maxwidth: 1150 }}>
          <CreateBookmark refresh={() => this.props.data.refetch()} />
          {this.props.data.allBookmarks.map((bookmark) => (
            <Bookmark
              key={bookmark.id}
              bookmark={bookmark}
              refresh={() => this.props.data.refetch()}
            />
          ))}
        </div>
        <main class="mw6 center">
        {this.props.children}
        </main>
      </div>
    )
  }
}


const FeedQuery = gql`query allBookmarks {
  allBookmarks(orderBy: createdAt_DESC) {
    id
    url
    title
    host
    imageURL
    description
  }
}`


const ListPageWithData = graphql(FeedQuery)(ListPage)

export default ListPageWithData
