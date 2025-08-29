import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const runLexical = (code) =>
  axios.post(`${API_BASE_URL}/lexical`, { code });

export const runSyntax = (code) =>
  axios.post(`${API_BASE_URL}/syntax`, { code });

export const runSemantic = (ast) =>
  axios.post(`${API_BASE_URL}/semantic`, { ast });

export const runIntermediate = (ast) =>
  axios.post(`${API_BASE_URL}/intermediate`, { ast });

export const runOptimize = (ast) =>
  axios.post(`${API_BASE_URL}/optimize`, { ast });

export const runCodegen = (ir) =>
  axios.post(`${API_BASE_URL}/codegen`, { ir });