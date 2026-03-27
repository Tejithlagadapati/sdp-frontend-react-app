import React from 'react'
import { Link } from 'react-router-dom'
import notFoundImage from '../assets/react.svg'
import './style.css'

const PageNotFound = () => {
	return (
		<div className="not-found-container">
			<img src={notFoundImage} alt="Page not found" className="not-found-image" />
			<h1 className="not-found-title">404 - Page Not Found</h1>
			<p className="not-found-text">The page you are looking for does not exist.</p>
			<Link to="/" className="not-found-home-link">Go To Home</Link>
		</div>
	)
}

export default PageNotFound