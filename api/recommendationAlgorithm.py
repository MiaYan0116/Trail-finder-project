'''
This is a recommendation engine with collaborative filtering that suggests trails based on users' wish lists
'''

import requests
import pandas as pd
import csv
import sys

BOOLEAN_COLMUNS = ['camping', 'publicTransit', 'dogFriendly']
CATEGORICAL_COLUMNS = ['difficulty']
WISHLIST_PATH = 'wishlist.csv'
TRAILLIST_PATH = 'traillist.csv'

# read the file and load data into a pandas DataFrame
def load_file(url, pathname):
    response = requests.get(url)
    with open(pathname, 'wb') as file:
        file.write(response.content)
    df = pd.read_csv(pathname)
    return df

# convert categorical variables to binary representation
def encode_data_frame(df):
    df_encoded = pd.get_dummies(df, columns = CATEGORICAL_COLUMNS)
    df_encoded[BOOLEAN_COLMUNS] = df_encoded[BOOLEAN_COLMUNS].astype(int)
    return df_encoded

# get the pattern based on users' wish list
def get_pattern(df, row_counts):
    pattern_dict = {}
    difficulty_count = 0
    difficulty_level = ""
    # Calculate the sum of all columns in a Pandas Dataframe
    for column in df.columns:
        if column in BOOLEAN_COLMUNS:
            score = df[column].sum() / row_counts
            pattern_dict[column] = 1 if score > 0.5 else 0
            
        elif (column == "difficulty_Easy" or column == "difficulty_Intermediate" or column == "difficulty_Difficult"):
            if df[column].sum() > difficulty_count:
                difficulty_count, difficulty_level = df[column].sum(), column 

    pattern_dict[difficulty_level] = 1
    return pattern_dict
  

# calculate similarity scores of each trail using simple matching coefficient 
def calculate_simple_matching_coefficient(pattern_dict, df):
    smc = {}
    denominator = len(pattern_dict)
    for i in range(len(df)):
        numerator = 0
        for property in pattern_dict:
            if df[property].values[i] == pattern_dict[property]:
                numerator += 1
        rating, trail_title = df["rating"].values[i], df["id"].values[i]
        smc[trail_title] = [numerator / denominator, rating]
    return smc


# sort trails based on smc and its rating
def sort_trails_based_on_smc_and_rating(smc, df):
    sorted_items = sorted(smc.items(), key=lambda item: (item[1][0], item[1][1]), reverse=True)
    items_to_remove = df["id"].tolist()
    sorted_items = [item for item in sorted_items if item[0] not in items_to_remove]
    return sorted_items

# get the top five trails
def top_trails(sorted_items):
    return dict(sorted_items[:5])


def recommend_trails(uid):
    pd.set_option('display.max_columns', None)
    df_wish_list = load_file('http://localhost:8000/csv/' + uid, WISHLIST_PATH)
    df_wish_list_encoded = encode_data_frame(df_wish_list)
    row_counts = len(df_wish_list_encoded)
    pattern_dict = get_pattern(df_wish_list_encoded, row_counts)

    df_trail_list = load_file('http://localhost:8000/csv_all', TRAILLIST_PATH)
    df_trail_list_encoded = encode_data_frame(df_trail_list)

    smc = calculate_simple_matching_coefficient(pattern_dict, df_trail_list_encoded)
    sorted_trails = sort_trails_based_on_smc_and_rating(smc, df_wish_list_encoded)
    res = top_trails(sorted_trails)
    print(res)
    return res
    # csv_file_path = 'output.csv'

    # # Open the CSV file in write mode
    # with open(csv_file_path, 'w', newline='') as csv_file:
    #     # Create a CSV writer object
    #     csv_writer = csv.writer(csv_file)

    #     # Write the header
    #     csv_writer.writerow(['trail id', 'similarity score', 'rating'])

    #     # Write the data to the CSV file
    #     for key, values in res.items():
    #         csv_writer.writerow([key] + values)

    

def main():
    if len(sys.argv) < 2:
        print("Error: Missing user ID argument.")
    else:
        # The first argument (index 0) is the script name, so user ID is at index 1
        userid = sys.argv[1]
        recommend_trails(userid)

if __name__ == "__main__":
    main()

    
