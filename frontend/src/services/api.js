import axios from 'axios';

const BASE_URL = 'https://compilasim.onrender.com';
// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const runLexical = (code) =>
  axios.post(`${BASE_URL}/lexical`, { code });

export const runSyntax = (code) =>
  axios.post(`${BASE_URL}/syntax`, { code });

export const runSemantic = (ast) =>
  axios.post(`${BASE_URL}/semantic`, { ast });

export const runIntermediate = (ast) =>
  axios.post(`${BASE_URL}/intermediate`, { ast });

export const runOptimize = (ast) =>
  axios.post(`${BASE_URL}/optimize`, { ast });

export const runCodegen = (ir) =>
  axios.post(`${BASE_URL}/codegen`, { ir });