import React, { Component } from 'react'
import Gravatar from 'react-gravatar'

class Option extends Component {
	constructor(props) {
		super(props)
		this.handleMouseDown = this.handleMouseDown.bind(this)
		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
	}

	handleMouseDown (e) {
		this.props.mouseDown(this.props.option, e)
	}

	handleMouseEnter (e) {
		this.props.mouseEnter(this.props.option, e)
	}

	handleMouseLeave (e) {
		this.props.mouseLeave(this.props.option, e)
	}

	render () {
		const obj = this.props.option
		const size = 30
		const gravatarStyle = {
			borderRadius: 3,
			display: 'inline-block',
			marginRight: 10,
			position: 'relative',
			top: -2,
			verticalAlign: 'middle'
		}

		return (
			<div className={this.props.className}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onMouseDown={this.handleMouseDown}
				onClick={this.handleMouseDown}>
				<Gravatar md5={obj.label} size={size} style={gravatarStyle} src={obj.icon} />
				{obj.key}
			</div>
		)
	}
}

export default Option