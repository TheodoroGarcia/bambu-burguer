"use server";

import supabase from "@/config/supabase-config";
import { ca } from "zod/v4/locales";

export const addNewProduct = async (payload: any) => {
  try {
    const { error } = await supabase.from("products").insert([payload]);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Produto adicionado com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const getProductsBySellerId = async (sellerId: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", sellerId).order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const getProductById = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const editProductById = async (productId: string, payload: any) => {
  try {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Produto atualizado com sucesso!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteProductById = async (productId: string) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Produto deletado com sucesso!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
