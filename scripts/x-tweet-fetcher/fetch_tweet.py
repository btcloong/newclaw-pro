#!/usr/bin/env python3
"""
Fetch tweets from X/Twitter without login or API keys.
Uses FxTwitter API (https://github.com/FxEmbed/FxEmbed)
"""

import argparse
import json
import sys
import urllib.request
import urllib.error
from typing import Optional, Dict, Any


def fetch_tweet(url: str) -> Optional[Dict[str, Any]]:
    """Fetch a single tweet by URL using FxTwitter API."""
    # Convert x.com/twitter.com URL to FxTwitter API URL
    fx_url = url.replace("https://x.com/", "https://api.fxtwitter.com/")
    fx_url = fx_url.replace("https://twitter.com/", "https://api.fxtwitter.com/")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; NewClawBot/1.0; +https://newclaw.pro)"
    }
    
    try:
        req = urllib.request.Request(fx_url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error fetching tweet: {e}", file=sys.stderr)
        return None


def fetch_user_timeline(username: str, count: int = 5) -> Optional[Dict[str, Any]]:
    """Fetch user timeline using FxTwitter API."""
    # Remove @ if present
    username = username.lstrip("@")
    
    fx_url = f"https://api.fxtwitter.com/{username}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; NewClawBot/1.0; +https://newclaw.pro)"
    }
    
    try:
        req = urllib.request.Request(fx_url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            if data.get("code") != 200:
                print(f"API Error: {data.get('message')}", file=sys.stderr)
                return None
            
            # Limit timeline items
            if data.get("data", {}).get("timeline"):
                data["data"]["timeline"] = data["data"]["timeline"][:count]
            
            return data
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error fetching timeline: {e}", file=sys.stderr)
        return None


def format_tweet_output(data: Dict[str, Any], text_only: bool = False) -> str:
    """Format tweet data for output."""
    if text_only:
        tweet = data.get("data", {}).get("tweet", {})
        return f"""
Author: {tweet.get('author', {}).get('name', 'Unknown')} (@{tweet.get('author', {}).get('screen_name', 'unknown')})
Date: {tweet.get('created_at', 'Unknown')}
Text: {tweet.get('text', 'No text')}
Likes: {tweet.get('likes', 0)} | Retweets: {tweet.get('retweets', 0)} | Replies: {tweet.get('replies', 0)} | Views: {tweet.get('views', 0)}
""".strip()
    
    return json.dumps(data, indent=2, ensure_ascii=False)


def format_timeline_output(data: Dict[str, Any], text_only: bool = False) -> str:
    """Format timeline data for output."""
    if text_only:
        user = data.get("data", {}).get("user", {})
        timeline = data.get("data", {}).get("timeline", [])
        
        output = [f"User: {user.get('name', 'Unknown')} (@{user.get('screen_name', 'unknown')})\n"]
        
        for i, tweet in enumerate(timeline, 1):
            output.append(f"""
--- Tweet {i} ---
Date: {tweet.get('created_at', 'Unknown')}
Text: {tweet.get('text', 'No text')[:200]}...
Likes: {tweet.get('likes', 0)} | Retweets: {tweet.get('retweets', 0)} | Views: {tweet.get('views', 0)}
""")
        
        return "\n".join(output)
    
    return json.dumps(data, indent=2, ensure_ascii=False)


def main():
    parser = argparse.ArgumentParser(description="Fetch tweets from X/Twitter")
    parser.add_argument("--url", help="Tweet URL to fetch")
    parser.add_argument("--user", help="Username to fetch timeline for")
    parser.add_argument("--count", type=int, default=5, help="Number of tweets to fetch (default: 5)")
    parser.add_argument("--text-only", action="store_true", help="Output human-readable text instead of JSON")
    parser.add_argument("--pretty", action="store_true", help="Pretty print JSON output")
    
    args = parser.parse_args()
    
    if not args.url and not args.user:
        parser.print_help()
        sys.exit(1)
    
    if args.url:
        # Fetch single tweet
        data = fetch_tweet(args.url)
        if data:
            print(format_tweet_output(data, args.text_only))
        else:
            sys.exit(1)
    else:
        # Fetch user timeline
        data = fetch_user_timeline(args.user, args.count)
        if data:
            print(format_timeline_output(data, args.text_only))
        else:
            sys.exit(1)


if __name__ == "__main__":
    main()
