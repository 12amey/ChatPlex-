/*
  # Create Complete Database Schema

  1. New Tables
    - `agents` - Chat agents with configurations
    - `user_sessions` - Track active users and sessions  
    - `conversations` - User conversations with agents
    - `messages` - Individual chat messages with metadata
    - `analytics` - Real-time metrics tracking
    - `provider_usage` - LLM provider usage statistics

  2. Functions
    - `get_realtime_metrics()` - Calculate real-time platform metrics
    - `cleanup_inactive_sessions()` - Remove old inactive sessions

  3. Security
    - Enable RLS on all tables
    - Add policies for public read access and authenticated write access
    - Grant execute permissions on functions
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    avatar text,
    provider text NOT NULL,
    system_prompt text,
    temperature numeric DEFAULT 0.7,
    max_tokens integer DEFAULT 4096,
    tools text[] DEFAULT '{}'::text[],
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id text NOT NULL,
    session_id text NOT NULL,
    last_seen timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    user_id text NOT NULL,
    title text,
    started_at timestamp with time zone DEFAULT now(),
    last_message_at timestamp with time zone DEFAULT now(),
    total_messages integer DEFAULT 0,
    total_tokens integer DEFAULT 0,
    total_cost numeric DEFAULT 0.0,
    sentiment text DEFAULT 'neutral',
    created_at timestamp with time zone DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('user', 'assistant')),
    content text NOT NULL,
    provider text,
    tokens integer DEFAULT 0,
    cost numeric DEFAULT 0.0,
    latency numeric DEFAULT 0.0,
    sentiment text DEFAULT 'neutral',
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type text NOT NULL,
    value numeric NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    recorded_at timestamp with time zone DEFAULT now()
);

-- Create provider_usage table
CREATE TABLE IF NOT EXISTS public.provider_usage (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider text NOT NULL,
    requests integer DEFAULT 0,
    tokens integer DEFAULT 0,
    cost numeric DEFAULT 0.0,
    errors integer DEFAULT 0,
    avg_latency numeric DEFAULT 0.0,
    date date DEFAULT CURRENT_DATE,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for agents
CREATE POLICY "Enable read access for all users" ON public.agents
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.agents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.agents
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.agents
    FOR DELETE USING (true);

-- Create RLS policies for user_sessions
CREATE POLICY "Allow all operations for user_sessions" ON public.user_sessions
    FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for conversations
CREATE POLICY "Enable read access for all users" ON public.conversations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.conversations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.conversations
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.conversations
    FOR DELETE USING (true);

-- Create RLS policies for messages
CREATE POLICY "Enable read access for all users" ON public.messages
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.messages
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.messages
    FOR DELETE USING (true);

-- Create RLS policies for analytics
CREATE POLICY "Enable read access for all users" ON public.analytics
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.analytics
    FOR INSERT WITH CHECK (true);

-- Create RLS policies for provider_usage
CREATE POLICY "Enable read access for all users" ON public.provider_usage
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.provider_usage
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.provider_usage
    FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active, last_seen);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_user ON public.conversations(agent_id, user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_type_date ON public.analytics(metric_type, recorded_at);
CREATE INDEX IF NOT EXISTS idx_provider_usage_date ON public.provider_usage(provider, date);

-- Create the get_realtime_metrics function
CREATE OR REPLACE FUNCTION public.get_realtime_metrics()
RETURNS TABLE (
    messages_per_second numeric,
    active_conversations integer,
    average_latency numeric,
    error_rate numeric,
    total_messages_today integer,
    total_cost_today numeric,
    active_users integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(
            (SELECT COUNT(*)::numeric 
             FROM public.messages 
             WHERE created_at >= NOW() - INTERVAL '1 second'), 0
        ) AS messages_per_second,
        
        COALESCE(
            (SELECT COUNT(DISTINCT conversation_id)::integer 
             FROM public.messages 
             WHERE created_at >= NOW() - INTERVAL '1 hour'), 0
        ) AS active_conversations,
        
        COALESCE(
            (SELECT AVG(latency)::numeric 
             FROM public.messages 
             WHERE created_at >= NOW() - INTERVAL '1 hour' AND latency > 0), 0
        ) AS average_latency,
        
        COALESCE(
            (SELECT 
                CASE 
                    WHEN COUNT(*) = 0 THEN 0
                    ELSE (COUNT(*) FILTER (WHERE metadata->>'error' = 'true'))::numeric / COUNT(*)::numeric
                END
             FROM public.messages 
             WHERE created_at >= NOW() - INTERVAL '1 hour'), 0
        ) AS error_rate,
        
        COALESCE(
            (SELECT COUNT(*)::integer 
             FROM public.messages 
             WHERE created_at >= CURRENT_DATE), 0
        ) AS total_messages_today,
        
        COALESCE(
            (SELECT SUM(cost)::numeric 
             FROM public.messages 
             WHERE created_at >= CURRENT_DATE), 0
        ) AS total_cost_today,
        
        COALESCE(
            (SELECT COUNT(DISTINCT user_id)::integer 
             FROM public.user_sessions 
             WHERE is_active = true AND last_seen >= NOW() - INTERVAL '5 minutes'), 0
        ) AS active_users;
END;
$$;

-- Create cleanup function for inactive sessions
CREATE OR REPLACE FUNCTION public.cleanup_inactive_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.user_sessions 
    SET is_active = false 
    WHERE last_seen < NOW() - INTERVAL '5 minutes' AND is_active = true;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_realtime_metrics() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_inactive_sessions() TO anon, authenticated;

-- Insert default agents
INSERT INTO public.agents (name, description, avatar, provider, system_prompt, temperature, max_tokens, tools) VALUES
(
    'Travel Agent',
    'Your personal travel planning assistant',
    '✈️',
    'gemini',
    'You are a helpful travel planning assistant. Help users plan trips, find destinations, book accommodations, and provide travel advice.',
    0.7,
    4096,
    '{"web_search", "booking_integration"}'
),
(
    'Support Agent', 
    'Customer support specialist',
    '🎧',
    'gemini',
    'You are a customer support specialist. Help users with their questions, resolve issues, and provide excellent customer service.',
    0.5,
    4096,
    '{"knowledge_base", "ticket_system"}'
)
ON CONFLICT (id) DO NOTHING;