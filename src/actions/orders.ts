"use server";

import supabase from "@/config/supabase-config";

export const saveOrderAndOrderItems = async ({
  orderPayload,
  items,
}: {
  orderPayload: any;
  items: any[];
}) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([orderPayload])
      .select("id");

    if (data?.length) {
      const itemsArrayForTable = items.map((item) => ({
        seller_id: item.seller_id,
        order_id: data[0].id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images[0],
        total: item.price * item.quantity,
      }));

      const { error } = await supabase
        .from("order_items")
        .insert(itemsArrayForTable);

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: true,
        message: "Pedido salvo com sucesso.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
