import React from 'react'
import Booklist from '../../Components/Booklist'
import Top from '../../Components/Top'

export default async function page({ searchParams }) {
  const params = (await searchParams) ?? {};

  return (
    <>
      <Top />
      <div className="mt-5">
        <Booklist searchParams={params} />
      </div>
    </>
  )
}
