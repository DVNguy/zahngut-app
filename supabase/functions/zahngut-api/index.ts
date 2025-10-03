import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Create Supabase client with service role for backend operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const pathname = url.pathname;

    // Route: GET /zahngut-api/praxis-info
    if (pathname.includes("/praxis-info") && req.method === "GET") {
      const { data, error } = await supabase
        .from("praxis_info")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Route: GET /zahngut-api/opening-hours
    if (pathname.includes("/opening-hours") && req.method === "GET") {
      const { data, error } = await supabase
        .from("opening_hours")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Route: GET /zahngut-api/treatments
    if (pathname.includes("/treatments") && req.method === "GET") {
      const { data, error } = await supabase
        .from("treatments")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Route: GET /zahngut-api/videos
    if (pathname.includes("/videos") && req.method === "GET") {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Route: GET /zahngut-api/aftercare
    if (pathname.includes("/aftercare") && req.method === "GET") {
      const { data, error } = await supabase
        .from("aftercare")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Route: GET /zahngut-api/news
    if (pathname.includes("/news") && req.method === "GET") {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Route: GET /zahngut-api/design-settings
    if (pathname.includes("/design-settings") && req.method === "GET") {
      const { data, error } = await supabase
        .from("design_settings")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Route: GET /zahngut-api/emergency-info
    if (pathname.includes("/emergency-info") && req.method === "GET") {
      const { data, error } = await supabase
        .from("emergency_info")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Route not found
    return new Response(JSON.stringify({ error: "Route not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
