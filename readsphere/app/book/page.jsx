import React from 'react'
import Booklist from '../../Components/Booklist'
import Top from '../../Components/Top'

export default async function page() {



  return (
    <>
      <Top />
      <div className="mt-5">
        <Booklist />
      </div>
    </>

  )
}
