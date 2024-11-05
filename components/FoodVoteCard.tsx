"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Food, Vote } from "@/types";

interface FoodVoteCardProps {
  food: Food;
  deliveryName: string;
  votes: Vote[];
  userId: string;
  onVote: (foodId: string, additionalRequests: string) => void;
}

export default function FoodVoteCard({
  food,
  deliveryName,
  votes,
  userId,
  onVote,
}: FoodVoteCardProps) {
  const [additionalRequests, setAdditionalRequests] = useState("");
  const hasVoted = votes.some(v => v.userId === userId);

  const handleVote = () => {
    onVote(food.id, additionalRequests);
    if (!hasVoted) {
      setAdditionalRequests("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{food.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{deliveryName}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">Votes: {votes.length}</p>
          <Textarea
            placeholder="Additional requests (optional)"
            value={additionalRequests}
            onChange={(e) => setAdditionalRequests(e.target.value)}
            className="h-20"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleVote}
          variant={hasVoted ? "destructive" : "default"}
          className="w-full"
        >
          {hasVoted ? "Remove Vote" : "Vote"}
        </Button>
      </CardFooter>
    </Card>
  );
}