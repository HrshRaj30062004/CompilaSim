import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000/api';

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
