import React, { Component } from 'react'
import Gravatar from 'react-gravatar'

class SingleValue extends Component {
	constructor(props) {
		super(props)
	}

	render () {
		const obj = this.props.value
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
				<div className="Select-placeholder">
					{obj ? (
						<div>
							<Gravatar md5={obj.label} size={size} style={gravatarStyle} src={obj.icon} srcset={obj.icon}/>
							{obj.key}
						</div>
					) : (
						this.props.placeholder
					)
				}
			</div>
		)
	}
}

export default SingleValue
