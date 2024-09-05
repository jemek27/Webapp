import psycopg2

# Połączenie z bazą danych
conn = psycopg2.connect("dbname=loraproject user=admin password=admin host=localhost")
cur = conn.cursor()


query = """
SELECT * FROM environmental_data WHERE timestamp = '2024-08-29T14:40:04.000Z'
"""

queryU = f"""
        UPDATE environmental_data
        SET solar_intensity = NULL
        WHERE solar_intensity = 54612.5;

    """
cur.execute(queryU)
cur.execute(query)

rows = cur.fetchall()
for row in rows:
    print(row)
    

# # Pobranie nazw kolumn z tabeli
# cur.execute("""
#     SELECT column_name 
#     FROM information_schema.columns 
#     WHERE table_name = 'environmental_data'
# """)
# columns = [row[0] for row in cur.fetchall() if row[0] not in ('id', 'timestamp')]

# for column in columns:
#     query = f"""
#         UPDATE environmental_data
#         SET {column} = NULL
#         WHERE {column} = 0;
#     """
#     cur.execute(query)

# query = f"""
#     DELETE FROM environmental_data
#     WHERE (
#         SELECT count(*)
#         FROM unnest(array[{','.join(columns)}]) AS val
#         WHERE val IS NULL or val = 0
#     ) > %s;
# """
# X = 7
# sum=0
# cur.execute(query, (X,))
# rows = cur.fetchall()
# for row in rows:
#     print(row)
#     sum += 1
# print(sum)
conn.commit()
cur.close()
conn.close()
