import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { registerHook } from '../../hooks.js';

const useImperativeQuery = (query) => {
  const { refetch } = useQuery(query, { skip: true });
	
  const imperativelyCallQuery = (variables) => {
    return refetch(variables);
  } 
	
  return imperativelyCallQuery;
}

registerHook("useImperativeQuery", useImperativeQuery);
