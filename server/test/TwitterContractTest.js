const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Twitter Contract", function () {
    let Twitter
    let twitter
    let owner

    const NUM_TOTAL_NOT_MY_TWEETS = 5
    const NUM_TOTAL_MY_TWEETS = 3

    let totalTweets
    let totalMyTweets

    beforeEach(async function () {
        Twitter = await ethers.getContractFactory("TwitterContract")
        ;[owner, addr1, addr2] = await ethers.getSigners()
        twitter = await Twitter.deploy()

        totalTweets = []
        totalMyTweets = []

        // Adding addr1's tweets
        for (let i = 0; i < NUM_TOTAL_NOT_MY_TWEETS; i++) {
            let tweet = {
                tweetText: "Random text with the id: " + i,
                username: addr1,
                isDeleted: false,
            }

            await twitter
                .connect(addr1)
                .addTweet(tweet.tweetText, tweet.isDeleted)
            totalTweets.push(tweet)
        }

        // Adding owner's tweets
        for (let i = 0; i < NUM_TOTAL_MY_TWEETS; i++) {
            let tweet = {
                tweetText:
                    "Random text with the id: " + (NUM_TOTAL_NOT_MY_TWEETS + i),
                username: owner,
                isDeleted: false,
            }

            await twitter.addTweet(tweet.tweetText, tweet.isDeleted)
            totalTweets.push(tweet)
            totalMyTweets.push(tweet)
        }
    })

    describe("Add Tweet", function () {
        it("It should emit the AddTweet event", async function () {
            let tweet = {
                tweetText: "New tweet",
                isDeleted: false,
            }

            await expect(
                await twitter.addTweet(tweet.tweetText, tweet.isDeleted)
            )
                .to.emit(twitter, "AddTweet")
                .withArgs(
                    owner.address,
                    NUM_TOTAL_NOT_MY_TWEETS + NUM_TOTAL_MY_TWEETS
                )
        })
    })

    describe("Get All Tweets", function () {
        it("Should return the correct number of tweets", async function () {
            const tweetsFromChain = await twitter.getAllTweets()
            expect(tweetsFromChain.length).to.equal(
                NUM_TOTAL_NOT_MY_TWEETS + NUM_TOTAL_MY_TWEETS
            )
        })

        it("Should return the correct number of certain user's  tweets", async function () {
            const userTweets = await twitter.getUserTweets()
            expect(userTweets.length).to.equal(NUM_TOTAL_MY_TWEETS)
        })
    })

    describe("Delete Tweet", function () {
        it("Should emit the Delete event", async function () {
            const TWEET_ID = 0
            const IS_DELETED = true
            await expect(
                twitter.connect(addr1).deleteTweet(TWEET_ID, IS_DELETED)
            )
                .to.emit(twitter, "DeleteTweet")
                .withArgs(TWEET_ID, IS_DELETED)
        })
    })
})
