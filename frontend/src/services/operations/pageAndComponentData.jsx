import React from 'react'
import toast from 'react-hot-toast'
import { apiConnector } from '../apiconnector';

export const getCatalogPageData = async(categoryId) => {
  const toastId = toast.loading("Loading Catalog Data...");
  let result = [];

  try{
    const respont = await apiConnector()
  }
  catch(error){

  }

  toast.dismiss(toastId);
  return result;
}