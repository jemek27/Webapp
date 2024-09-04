import psycopg2

# Połączenie z bazą danych
conn = psycopg2.connect("dbname=loraproject user=admin password=admin host=localhost")
cur = conn.cursor()

# Pobranie nazw kolumn z tabeli
cur.execute("""
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'environmental_data'
""")
columns = [row[0] for row in cur.fetchall() if row[0] not in ('id', 'timestamp')]


for column in columns:
    query = f"""
        UPDATE environmental_data
        SET {column} = NULL
        WHERE {column} = 0;
    """
    cur.execute(query)

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
