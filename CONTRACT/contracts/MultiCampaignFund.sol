// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultiCampaignFund {
    address public superAdmin;

// thông tin quỹ
    struct Campaign {
        uint256 id;
        string name;
        string description;
        uint256 goal;
        uint256 totalDonated;
        bool active;
        address owner;
    }

    Campaign[] public campaigns; // lưu nhiều quỹ
    mapping(uint256 => mapping(address => uint256)) public donations;


// sự kiện để backend theo dõi
    event CampaignCreated(uint256 indexed id, string name, uint256 goal, address owner);
    event Donated(uint256 indexed campaignId, address indexed donor, uint256 amount, uint256 timestamp);
    event Withdrawn(uint256 indexed campaignId, address indexed recipient, uint256 amount);

    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, "Only super admin");
        _;
    }

    modifier campaignExists(uint256 _id) {
        require(_id < campaigns.length, "Campaign does not exist");
        require(campaigns[_id].active, "Campaign not active");
        _;
    }

    constructor() {
        superAdmin = msg.sender;
    }


// tạo quỹ mới
    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goal
    ) external onlySuperAdmin {
        require(bytes(_name).length > 0, "Empty name");
        require(_goal > 0, "Goal must be >0");

        uint256 newId = campaigns.length;
        campaigns.push(Campaign({
            id: newId,
            name: _name,
            description: _description,
            goal: _goal,
            totalDonated: 0,
            active: true,
            owner: superAdmin
        }));

        emit CampaignCreated(newId, _name, _goal, superAdmin);
    }


// quyên góp cho quỹ
    function donate(uint256 _campaignId) external payable campaignExists(_campaignId) {
        require(msg.value > 0, "Donation >0");
        Campaign storage campaign = campaigns[_campaignId];
        campaign.totalDonated += msg.value;
        donations[_campaignId][msg.sender] += msg.value;
        emit Donated(_campaignId, msg.sender, msg.value, block.timestamp);
    }


//rut tiền từ quỹ về tài khoản theo hạn mức
    function withdraw(uint256 _campaignId, address payable _recipient, uint256 _amount) 
        external 
        onlySuperAdmin 
        campaignExists(_campaignId) 
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(_amount > 0, "Amount must be > 0");
        require(campaign.totalDonated >= _amount, "Insufficient funds in campaign");
        
        campaign.totalDonated -= _amount;
        (bool sent, ) = _recipient.call{value: _amount}("");
        require(sent, "Transfer failed");
        
        emit Withdrawn(_campaignId, _recipient, _amount);
    }


// các hàm xem thông tin quỹ
    function getCampaignsCount() external view returns (uint256) {
        return campaigns.length;
    }

    function getCampaign(uint256 _id) external view returns (Campaign memory) {
        require(_id < campaigns.length, "Invalid ID");
        return campaigns[_id];
    }

    function getCampaigns(uint256 _offset, uint256 _limit) external view returns (Campaign[] memory) {
        uint256 total = campaigns.length;
        if (_offset >= total) return new Campaign[](0);
        uint256 end = _offset + _limit;
        if (end > total) end = total;
        uint256 resultCount = end - _offset;
        Campaign[] memory result = new Campaign[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = campaigns[_offset + i];
        }
        return result;
    }


//trạng thái quỹ
    function setActive(uint256 _campaignId, bool _active) external onlySuperAdmin {
        require(_campaignId < campaigns.length, "Invalid campaign");
        campaigns[_campaignId].active = _active;
    }
}