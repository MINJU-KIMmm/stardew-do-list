from boto3.dynamodb.conditions import Key
import boto3
import time

positive_adjectives = [
    '아름다운',
    '행복한',
    '유쾌한',
    '멋진',
    '참신한',
    '놀라운',
    '신나는',
    '멋대로인',
    '활기찬',
    '발랄한',
    '따뜻한',
    '낭만적인',
    '감동적인',
    '대단한',
    '친절한',
    '자유로운',
    '세련된',
    '성공적인',
    '안전한',
    '즐거운',
    '웅장한',
    '귀여운',
    '꿈같은',
    '만족스러운',
    '인기 있는',
    '스마트한',
    '똑똑한',
    '실용적인',
    '강력한',
    '재능 있는',
    '청렴한',
    '희망찬',
    '흥미로운',
    '창의적인',
    '인상적인',
    '부드러운',
    '사랑스러운',
    '기뻐하는',
    '기운넘치는',
    '화려한',
    '멋부리는',
    '경쾌한',
    '영감을 주는',
    '짜릿한',
    '깨끗한',
    '포근한',
    '상쾌한',
    '열정적인',
    '우아한',
    '도전적인',
    '승리한',
    '적극적인',
    '쾌적한',
    '장엄한',
    '아슬아슬한',
    '즉흥적인',
    '명쾌한',
    '단정한',
    '부지런한',
    '신중한',
    '자부심 있는',
    '경쟁적인',
    '신속한',
    '풍성한',
    '무궁한',
    '천하장사',
    '예쁜',
    '매혹적인',
    '독특한',
    '명랑한',
    '멋스러운',
    '색다른',
    '완벽한',
    '아낌없는',
    '우정있는',
    '믿을 수 있는',
    '고마운',
    '지혜로운',
    '올바른',
    '치유하는',
    '확실한',
    '고운',
    '자연스러운',
    '다정한',
    '성실한',
    '참된',
    '균형잡힌',
    '끈기있는',
    '융통성 있는',
    '동경스러운',
    '풍부한',
    '참다운',
    '냉철한',
    '빠른',
    '유능한',
    '빛나는',
    '건강한',
    '혁신적인',
    '우수한',
    '완벽한']

count_list = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153, 171, 190, 210, 231, 253, 276, 300, 325, 351, 378, 406, 435, 465, 496, 528, 561, 595, 630, 666, 703, 741, 780, 820, 861, 903, 946, 990, 1035, 1081, 1128, 1176, 1225, 1275, 1326, 1378, 1431, 1485, 1540, 1596, 1653, 1711, 1770, 1830, 1891, 1953, 2016, 2080, 2145, 2211, 2278, 2346, 2415, 2485, 2556, 2628, 2701, 2775, 2850, 2926, 3003, 3081, 3160, 3240, 3321, 3403, 3486, 3570, 3655, 3741, 3828, 3916, 4005, 4095, 4186, 4278, 4371, 4465, 4560, 4656, 4753, 4851, 4950, 5050]
dynamodb = boto3.resource('dynamodb')
todo_table = dynamodb.Table('todo')
achieve_table = dynamodb.Table('achievement')

def upload_post(title, game_day, user_name):

    now_time = str(time.strftime('%c', time.localtime()))

    item = {'createdDate':now_time, 'userName':user_name, 'title': title, 'gameDay': game_day}
    todo_table.put_item(Item = item)

    result = todo_table.query(
        IndexName = "userName-index",
        KeyConditionExpression = Key('userName').eq(user_name)
    )
    print(result)


    print(len(positive_adjectives))
    print(len(count_list))
    if result['Count'] <= 100 and result['Count'] in count_list:
        idx = count_list.index(result['Count'])
        item = {'date':now_time, 'user':user_name, 'title':positive_adjectives[idx]}
        achieve_table.put_item(Item=item)


def get_today_todo(game_day, user_name):
    result = todo_table.query(
        IndexName="gameDay-index",
        KeyConditionExpression=Key('gameDay').eq(game_day)
    )

    print(result)
    return result