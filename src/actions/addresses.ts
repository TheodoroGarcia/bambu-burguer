"use server";

import supabase from "@/config/supabase-config";

export const addAddress = async (payload: any) => {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .insert([payload])
      .select("*");
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

export const getAddressesByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId);

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

export const deleteAddress = async (addressId: number) => {
  try {
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Endereço excluído com sucesso",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const updateAddress = async (addressId: number, payload: any) => {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .update(payload)
      .eq("id", addressId)
      .select("*");

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
