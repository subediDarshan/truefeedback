"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import ApiResponse from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/message.schema";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [suggestions, setSuggestions] = useState<string[]>([
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?",
  ]);
  const [suggestionsError, setSuggestionsError] = useState("");

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsLoadingSuggestion(true);
    try {
      const response = await axios.post("/api/suggest-messages");
      if (!response.data.success) {
        setSuggestionsError(response.data.message);
      } else {
        setSuggestions(response.data.data.messages);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message ?? "Failed to sent message",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
    >
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Public Profile Link
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !messageContent}>
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="space-y-4 my-8">
          <div className="space-y-2">
            {isLoadingSuggestion ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoadingSuggestion}
                onClick={fetchSuggestedMessages}
              >
                Suggest messages
              </Button>
            )}
            <p>Click on any message below to select it.</p>
          </div>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              {suggestionsError ? (
                <p className="text-red-500">{suggestionsError}</p>
              ) : (
                suggestions.map((s, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="mb-2"
                    onClick={() => handleMessageClick(s)}
                  >
                    {s}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-4">Get Your Message Board</div>
          <Link href={"/sign-up"}>
            <Button>Create Your Account</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
