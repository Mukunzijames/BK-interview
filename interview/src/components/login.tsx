import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

interface IFormInput {
 email: string;
 password: string;
}

const LoginForm: React.FC = () => {
 const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
 const navigate = useNavigate();

 const onSubmit: SubmitHandler<IFormInput> = async (data) => {
 try {
 const response = await axios.post('https://afrodrama.com/api/v1.0/Auth/login', data);
 const token = response.data.token;
 localStorage.setItem('token', token);

 const decodedToken = decodeToken(token);
 console.log('Decoded Token:', decodedToken);

 const modifiedToken = removeUserDataFromToken(token);
 console.log('Modified Token:', modifiedToken);

 navigate('/dashboard');
 } catch (error) {
 console.error('Login failed', error);
 }
 };

 const decodeToken = (token: string) => {
 const parts = token.split('.');
 if (parts.length !== 3) {
 throw new Error('Token is not valid');
 }
 const header = JSON.parse(atob(parts[0]));
 const payload = JSON.parse(atob(parts[1]));
 return { header, payload };
 };

 const encodeToken = (header: any, payload: any, signature: string) => {
 const encodeBase64 = (obj: any) => btoa(JSON.stringify(obj)).replace(/=/g, '');
 const newHeader = encodeBase64(header);
 const newPayload = encodeBase64(payload);
 return `${newHeader}.${newPayload}.${signature}`;
 };

 const removeUserDataFromToken = (token: string) => {
 const parts = token.split('.');
 if (parts.length !== 3) {
 throw new Error('Token is not valid');
 }
 const header = JSON.parse(atob(parts[0]));
 const payload = JSON.parse(atob(parts[1]));
 
 // Remove specific fields
 delete payload.name;
 delete payload.email;
 delete payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"];

 const signature = parts[2];
 return encodeToken(header, payload, signature);
 };

 return (
 <div className="login-form">
 <h2>Login</h2>
 <form onSubmit={handleSubmit(onSubmit)}>
 <div>
 <label htmlFor="email">Email:</label>
 <input
 id="email"
 type="email"
 {...register('email', {
 required: 'Email is required',
 pattern: {
 value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
 message: 'Invalid email address'
 }
 })}
 />
 {errors.email && <p>{errors.email.message}</p>}
 </div>
 <div>
 <label htmlFor="password">Password:</label>
 <input
 id="password"
 type="password"
 {...register('password', {
 required: 'Password is required',
 minLength: {
 value: 6,
 message: 'Password must be at least 6 characters'
 }
 })}
 />
 {errors.password && <p>{errors.password.message}</p>}
 </div>
 <button type="submit">Login</button>
 </form>
 </div>
 );
};

export default LoginForm;
