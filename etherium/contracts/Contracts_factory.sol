// SPDX-License-Identifier: GPL-3.0

// https://github.com/FarrisIsmati/campaign-solidity0.8.0/blob/master/contracts/Campaign.sol
pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address campaignAddress = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(campaignAddress);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    // Creating a atructure
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approval;
    }

    // Initilizing request variable
    uint256 numRequests = 0;
    // mapping(uint => Request) public requests;
    Request[] public requests;
    address public manager;
    uint256 public minimiumContribution;
    uint256 public approversCount;
    // address payable[] public approvers;
    mapping(address => bool) public approvers;

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimiumContribution = minimum;
    }

    function create_request(
        string memory description,
        uint256 value,
        address payable recipient
    ) public lock {
        // require(approvers[msg.sender]);
        uint256 requestID = numRequests++;
        Request storage r = requests[requestID];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
        r.approvalCount++;

        // requests.push(newRequest);
    }

    function contribute() public payable money_rest {
        // approvers.push(payable(msg.sender));
        approvers[msg.sender] = true;
        approversCount++;
    }

    modifier money_rest() {
        require(msg.value >= minimiumContribution);
        _;
    }

    modifier lock() {
        require(msg.sender == manager);
        _;
    }

    function approve_request(uint256 requestId) public {
        require(approvers[msg.sender]);

        Request storage r = requests[requestId];
        require(!r.approval[msg.sender]);

        r.approval[msg.sender] = true;
        r.approvalCount++;
    }

    function finalizeRequest(uint256 requestId) public lock {
        Request storage r = requests[requestId];

        require(!r.complete);
        require(r.approvalCount > (approversCount / 2));

        r.recipient.transfer(r.value);
        r.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimiumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
