pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Voter {

    struct OptionPos {
        uint pos;
        bool exists;
    }

    struct VoterInfo {
        bool allowed;
        bool voted;
    }

    struct Voting {
        bool exists;
        bool started;
        bool ended;
        string question;
        address owner;
        uint[] votes;
        string[] options;
        mapping(address => VoterInfo) voterInfos;
        mapping(string => OptionPos) optionsPos;
    }

    mapping(string => Voting) votings;


    function createVoting(string memory votingName, string memory question, string[] memory options, address[] memory voters) public {
        bool alreadyExists = votings[votingName].exists;
        require(!alreadyExists, "Voting of this name already exists");

        Voting memory v;
        votings[votingName] = v;

        Voting storage voting = votings[votingName];

        voting.exists = true;
        voting.options = options;
        voting.question = question;
        for (uint i = 0; i < voters.length; i++) {
            VoterInfo memory voterInfo = VoterInfo(true, false);
            voting.voterInfos[voters[i]] = voterInfo;
        }
        for (uint i = 0; i < options.length; i++) {
            OptionPos memory option = OptionPos(i, true);
            voting.optionsPos[options[i]] = option;
        }
        voting.owner = msg.sender;
    }


    function startVoting(string memory votingName) public {
        Voting storage voting = votings[votingName];
        require(voting.owner == msg.sender, "Only the voting owner can start the voting");
        require(!voting.started, "Voting has already started");
        voting.started = true;
    }

    function vote(string memory votingName, string memory option) public {
        Voting storage voting = votings[votingName];
        require(voting.exists, "Voting does not exist");
        require(voting.started, "Voting has not started yet");
        require(!voting.ended, "Voting has already ended");
        require(voting.voterInfos[msg.sender].allowed, "Caller not allowed to vote");
        require(voting.voterInfos[msg.sender].voted, "Caller has already voted");

        OptionPos memory optionPos = voting.optionsPos[option];
        require(optionPos.exists, "Option does not exist");
        voting.votes[optionPos.pos] = voting.votes[optionPos.pos] + 1;
        voting.voterInfos[msg.sender].voted = true;
    }

    function endVoting(string memory votingName) public {
        Voting storage voting = votings[votingName];
        require(voting.exists, "Voting does not exist");
        require(!voting.ended, "Voting has already ended");
        require(voting.owner == msg.sender, "Only the voting owner can end the voting");
        voting.ended = true;
    }

    function getVotes(string memory votingName) public view returns (uint[] memory) {
        require(votings[votingName].exists, "Voting does not exist");
        return votings[votingName].votes;
    }

    function getVoting(string memory votingName) public view returns (string[] memory){
        require(votings[votingName].exists, "Voting does not exist");
        Voting memory voting = votings[votingName];
        string[] memory resultArray = new string[](voting.options.length + 1);
        resultArray[0] = voting.question;
        for (uint i = 1; i < voting.options.length + 1; i++) {
            resultArray[i] = voting.options[i - 1];
        }
        return resultArray;
    }

}