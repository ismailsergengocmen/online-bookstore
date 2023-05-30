import React, { useState } from 'react';
import { Button, Form, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Message from '../components/Message';

import axios from 'axios';

const CreateAddress = ({ history }) => {
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [country, setCountry] = useState('');

	const [error, setError] = useState(false);

	const create = async () => {
		// TODO This should be current user !!
		const currentUserID = 1;
		const addressInfo = {
			streetAddress: address.trim(),
			city: city.trim(),
			state: state.trim(),
			postalCode: postalCode.trim(),
			country: country.trim(),
		};

		try {
			await axios.post(`http://localhost:8080/api/v1/customers/${currentUserID}/addresses`, addressInfo);
			setError(false);
			history.push('/shipping');
		} catch (e) {
			console.error(e.response);
			setError(true);
		}
	};

	return (
		<>
			<Form>
				<Form.Group controlId='address'>
					<Form.Label>Address</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter address'
						value={address}
						required
						onChange={(e) => setAddress(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId='city'>
					<Form.Label>City</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter city'
						value={city}
						required
						onChange={(e) => setCity(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId='city'>
					<Form.Label>State</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter state'
						value={state}
						required
						onChange={(e) => setState(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId='postalCode'>
					<Form.Label>Postal Code</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter postal code'
						value={postalCode}
						required
						onChange={(e) => setPostalCode(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId='country'>
					<Form.Label>Country</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter country'
						value={country}
						required
						onChange={(e) => setCountry(e.target.value)}
					></Form.Control>
				</Form.Group>

				{error ? (
					<Col className='px-0'>
						<Message variant='danger'>A problem occured. Try again.</Message>
					</Col>
				) : (
					''
				)}

				<Button variant='primary' onClick={create}>
					Create Address
				</Button>
			</Form>
		</>
	);
};

export default CreateAddress;