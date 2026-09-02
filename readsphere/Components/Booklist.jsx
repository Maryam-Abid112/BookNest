import React from 'react'
import Bookcard from './Bookcard'
import Link from 'next/link'
import {getbook} from '../lib/getbook';

export default async function  page() {
    const data = await getbook();    
    console.log(data);
    

     

  return (
    <>
    <div className="container"> 
      <h1 className="mb-4">Books Collection</h1>
      <div className="d-flex flex-row gap-4 flex-wrap">
      {data.map((books) => (
        <Bookcard
          key={books._id}
          book={books}
        />
      ))}
      </div>

  
</div>
    
</>
  )
}
