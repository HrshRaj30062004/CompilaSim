import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const runLexical = (code) =>
  axios.post(`${API_BASE_URL}/api/lexical`, { code });

export const runSyntax = (code) =>
  axios.post(`${API_BASE_URL}/api/syntax`, { code });

export const runSemantic = (ast) =>
  axios.post(`${API_BASE_URL}/api/semantic`, { ast });

export const runIntermediate = (ast) =>
  axios.post(`${API_BASE_URL}/api/intermediate`, { ast });

export const runOptimize = (ast) =>
  axios.post(`${API_BASE_URL}/api/optimize`, { ast });

export const runCodegen = (ir) =>
  axios.post(`${API_BASE_URL}/api/codegen`, { ir });