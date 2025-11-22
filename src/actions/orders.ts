"use server";

import supabase from "@/config/supabase-config";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

export const getOrdersOfUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*), addresses(*)")
      .eq("customer_id", userId);
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

export const getOrderedItemsOfSeller = async (sellerId: string) => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .select(`
        *,
        orders!inner(
          id,
          order_status,
          payment_id,
          created_at,
          addresses(
            name,
            address,
            neighborhood,
            number,
            phone_number
          )
        )
      `)
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const cancelOrder = async (orderId: number, paymentId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ order_status: "cancelled" })
      .eq("id", orderId);
    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
    });
    if (refund.error) {
      return {
        success: false,
        message: refund.error.message,
      };
    }
    return {
      success: true,
      message: "Pedido cancelado e reembolso iniciado com sucesso.",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

export const markOrderAsDelivered = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ order_status: "delivered" })
      .eq("id", orderId);
    
    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Pedido marcado como entregue com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
