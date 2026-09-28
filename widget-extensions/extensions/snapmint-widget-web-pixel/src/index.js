import { register } from "@shopify/web-pixels-extension";

register(({ analytics, browser, init, settings }) => {
  // ─── Common Context ───────────────────────────────────────────────
  const WIDGET_VERSION = "1.0.0";
  const merchantId = settings.accountID || "unknown";

  const getCommonContext = (event) => ({
    merchant_id: merchantId,
    session_id: event?.id || crypto.randomUUID(),
    platform: "shopify",
    device: navigator?.userAgent || "unknown",
    widget_version: WIDGET_VERSION,
    config_version: "1",
    timestamp: event?.timestamp || new Date().toISOString(),
  });

  // ─── Event Sender ─────────────────────────────────────────────────
  const sendEvent = (eventName, eventData, originalEvent) => {
    const payload = {
      event_name: eventName,
      ...getCommonContext(originalEvent),
      ...eventData,
    };

    // Log to console for debugging (visible in Shopify's Customer Events debug mode)
    console.log(`[snapmint-pixel] ${eventName}`, payload);

    // TODO: Replace with your actual analytics endpoint
    // fetch("https://your-analytics-endpoint.com/events", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    //   keepalive: true,
    // });
  };

  // ─── Shopify Standard Events ──────────────────────────────────────

  analytics.subscribe("page_viewed", (event) => {
    sendEvent(
      "page_viewed",
      {
        page_url: event.context?.document?.location?.href,
        page_title: event.context?.document?.title,
        referrer: event.context?.document?.referrer,
      },
      event,
    );
  });

  analytics.subscribe("product_viewed", (event) => {
    const product = event.data?.productVariant;
    sendEvent(
      "product_viewed",
      {
        product_id: product?.product?.id,
        product_title: product?.product?.title,
        variant_id: product?.id,
        price: product?.price?.amount,
        currency: product?.price?.currencyCode,
      },
      event,
    );
  });

  analytics.subscribe("checkout_started", (event) => {
    sendEvent(
      "checkout_started",
      {
        checkout_token: event.data?.checkout?.token,
        total_price: event.data?.checkout?.totalPrice?.amount,
        currency: event.data?.checkout?.currencyCode,
        line_items_count: event.data?.checkout?.lineItems?.length,
      },
      event,
    );
  });

  analytics.subscribe("payment_info_submitted", (event) => {
    sendEvent(
      "payment_info_submitted",
      {
        checkout_token: event.data?.checkout?.token,
      },
      event,
    );
  });

  analytics.subscribe("checkout_completed", (event) => {
    sendEvent(
      "checkout_completed",
      {
        order_id: event.data?.checkout?.order?.id,
        total_price: event.data?.checkout?.totalPrice?.amount,
        currency: event.data?.checkout?.currencyCode,
      },
      event,
    );
  });

  // ─── Custom Widget Events ─────────────────────────────────────────
  // These are dispatched from the storefront widget using:
  //   Shopify.analytics.publish("event_name", { ...data })

  // Fires when widget initializes on PDP
  analytics.subscribe("snapmint_widget_loaded", (event) => {
    sendEvent(
      "widget_loaded",
      {
        product_id: event.customData?.product_id,
        page_url: event.customData?.page_url,
        price: event.customData?.price,
        placement: event.customData?.placement,
        render_ms: event.customData?.render_ms,
      },
      event,
    );
  });

  // Fires when widget enters viewport
  analytics.subscribe("snapmint_widget_impression", (event) => {
    sendEvent(
      "widget_impression",
      {
        placement: event.customData?.placement,
      },
      event,
    );
  });

  // Fires when shopper taps the widget
  analytics.subscribe("snapmint_widget_clicked", (event) => {
    sendEvent(
      "widget_clicked",
      {
        placement: event.customData?.placement,
      },
      event,
    );
  });

  // Fires when plan popup opens
  analytics.subscribe("snapmint_plan_popup_viewed", (event) => {
    sendEvent(
      "plan_popup_viewed",
      {
        down_payment: event.customData?.down_payment,
        tenure_options: event.customData?.tenure_options,
        value_props_shown: event.customData?.value_props_shown,
      },
      event,
    );
  });

  // Fires when shopper selects a plan
  analytics.subscribe("snapmint_plan_option_selected", (event) => {
    sendEvent(
      "plan_option_selected",
      {
        tenure: event.customData?.tenure,
        emi_amount: event.customData?.emi_amount,
        down_payment: event.customData?.down_payment,
      },
      event,
    );
  });

  // Fires when shopper taps popup CTA
  analytics.subscribe("snapmint_cta_clicked", (event) => {
    sendEvent(
      "cta_clicked",
      {
        cta_type: event.customData?.cta_type,
      },
      event,
    );
  });

  // Fires when render or fetch fails
  analytics.subscribe("snapmint_widget_error", (event) => {
    sendEvent(
      "widget_error",
      {
        error_type: event.customData?.error_type,
        stage: event.customData?.stage,
      },
      event,
    );
  });

  // Periodic successful render heartbeat
  analytics.subscribe("snapmint_widget_heartbeat", (event) => {
    sendEvent(
      "widget_heartbeat",
      {
        render_ms: event.customData?.render_ms,
      },
      event,
    );
  });
});
