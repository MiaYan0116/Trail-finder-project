# Trail-finder-project
## Team Members
## （Mia）Jiaxin Yan，（Grace）Ya Xiao

## Data Model
### The data model of TrailFinder app includes the following three collections:

## 1. traillist
### Description:
### the trails in Greater Vancouver Area

### Attributes:
#### id: unique identifier of the trail

#### trailTitle: the name of the trail

#### camping: the boolean value indicating whether camping is allowed within the trail area

#### difficulty: the difficulty level of the trail

#### dogFriendly: the boolean value indicating whether the trail is dog-friendly

#### publicTransit: the boolean value indicating whether public transit is accessible

#### rating: the rating of the trail

#### imageUri: the uri of the trail image


## 2. users
### Description:
### the app users which are hiking-lovers

### Attributes:
#### uid: unique identifier of the user

#### username: name of the user

#### email: the login email of the user

#### description: the self-description of the user

#### avatarUri: the uri of the user


## 3. Wishlist:
### Description:
### the list of liked trails of each app user

### Attributes:
#### createdAt: the time of the wishitem created

#### userCid: unique identifier of the user

#### trailTitle: the title of the trail
