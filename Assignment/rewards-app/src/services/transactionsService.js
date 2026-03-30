import React from 'react'
import logger from '../utils/logger'
export const fetchTransactions = async() => {
    try {
        const response = await fetch('/mock/mocktransactions.json');
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json();
        if(!Array.isArray(data)){
            throw new Error(`Invalid transactions payload`)
        }
        return data;
    } catch(err){
        logger.error('Transaction fetch failed',{error:err.message});
    }
}