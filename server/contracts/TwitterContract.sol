// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

contract TwitterContract {
    event AddTweet(address creator, uint256 tweetId);
    event DeleteTweet(uint256 tweetId, bool isDeleted);

    struct Tweet {
        uint256 id;
        address username;
        bool isDeleted;
        string tweetText;
    }

    Tweet[] private tweets;

    mapping(uint256 => address) tweetToOwner;

    // Method that adds a new tweet
    function addTweet(string memory _tweetText, bool _isDeleted) external {
        uint256 tweetId = tweets.length;
        tweets.push(Tweet(tweetId, msg.sender, _isDeleted, _tweetText));
        tweetToOwner[tweetId] = msg.sender;
        emit AddTweet(msg.sender, tweetId);
    }

    // Method that gets all the tweets

    function getAllTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length);

        uint256 counter = 0;
        for (uint256 i = 0; i < tweets.length; i++) {
            if (tweets[i].isDeleted == false) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }

        return result;
    }

    // Method to only certain user's tweets
    function getUserTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length);

        uint256 counter = 0;
        for (uint256 i = 0; i < tweets.length; i++) {
            if (tweetToOwner[i] == msg.sender && tweets[i].isDeleted == false) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }

        return result;
    }

    // Method to delete a tweet
    function deleteTweet(uint256 _tweetId, bool _isDeleted) external {
        if (tweetToOwner[_tweetId] == msg.sender) {
            tweets[_tweetId].isDeleted = _isDeleted;
            emit DeleteTweet(_tweetId, _isDeleted);
        }
    }
}
