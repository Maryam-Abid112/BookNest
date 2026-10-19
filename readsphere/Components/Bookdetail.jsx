"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import {addtolibrary} from '../lib/Library'
import {addToCart} from '../lib/Cart'

export default function Bookdetail({ book }) {
    const [quantity, setQuantity] = useState(1);
    const [cartMessage, setCartMessage] = useState("");
    const availableQuantity = Number.isSafeInteger(book.quantity) ? book.quantity : 0;

    const addlibrary=async(e)=>{
    e.preventDefault();
    const data=await addtolibrary(book._id);
    console.log(data);
    alert("Added to Library");

  }

    const handleAddToCart = async () => {
        setCartMessage("");
        try {
            await addToCart(book._id, quantity);
            setCartMessage(`${quantity} ${quantity === 1 ? "copy" : "copies"} added to your cart.`);
        } catch (error) {
            setCartMessage(error.message);
        }
    };

    return (
        <>
            <div className="container py-5">

                {/* Back Button */} <Link href="/" className="btn btn-outline-dark mb-4"> ← Back to Books </Link>
            
                {/* Book Details */}
               
                <div className="row g-5"> {/* Cover */}
                    <div className="col-md-4">
                        <img src={book.coverImage} alt={book.title} className="img-fluid rounded shadow" />
                    </div> {/* Information */}
                    <div className="col-md-8">
                        <h1 className="display-5 fw-bold mb-3"> {book.title} </h1>
                        <h4 className="text-muted mb-4"> by {book.author} </h4>
                        <p className="mb-4"> {book.description} </p> {/* Published Year */} <p>
                            <strong>Published:</strong> {book.publishedYear} </p> {/* Genres */}
                        <p><strong>Price:</strong> {Number.isFinite(book.price) ? book.price.toFixed(2) : "Not set"}</p>
                        <div className="mb-4"> <strong>Genres:</strong>
                            <div className="d-flex flex-wrap gap-2 mt-2"> {book.genres.map((genre) => (<Link key={genre} href={`/Genre/${encodeURIComponent(genre)}`} className="badge text-bg-light border text-decoration-none" > {genre} </Link>))}
                           
                            </div>
                              <button className=' btn btn-outline-dark mt-3' onClick={addlibrary}>Add to library</button>
                              <div className="mt-3">
                                <label className="form-label" htmlFor="cart-quantity">Quantity</label>
                                <input
                                    id="cart-quantity"
                                    type="number"
                                    min="1"
                                    max={availableQuantity}
                                    value={quantity}
                                    className="form-control"
                                    style={{ maxWidth: "120px" }}
                                    onChange={(event) => setQuantity(Number(event.target.value))}
                                />
                                <button
                                    type="button"
                                    className="btn btn-dark mt-2"
                                    onClick={handleAddToCart}
                                    disabled={availableQuantity < 1 || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > availableQuantity}
                                >
                                    Add to cart
                                </button>
                                {cartMessage && <p className="mt-2 mb-0" role="status">{cartMessage}</p>}
                              </div>
                        </div>
                    </div></div></div>
                    
        </>
    )
}
