import pymssql
import app.config as conf

class BaseModel():
    __database__ = ""
    __primarykey__ = ""
    __connection__ = None

    def __init__(self):
        config = conf.DATABASE_ACCOUNT[self.__database__]
        self.__connection__ = pymssql.connect(
                server=config["SERVER"],
                database=config["database"],
                user=config["user"],
                password=config["password"]
            )

    def callproc(self, query, parameters):
        try:
            cursor = self.__connection__.cursor()
            cursor.execute(query, parameters)
            rows = cursor.fetchall()
            return (rows, "")
        except pymssql.Error as e:
            print(str(e))
            return (None, str(e))


    def execute(self, query, parameters):
        try:
            cursor = self.__connection__.cursor()
            cursor.execute(query, parameters)
            rows = cursor.fetchall()
            return (rows, "")
        except pymssql.Error as e:
            print(str(e))
            return (None, str(e))


class BaseTable(BaseModel):
    __tablename__ = ""
    __fields__ = []

    def __init__(self):
        super().__init__()


    def new_id(self):
        try:
            cursor = self.__connection__.cursor()
            query = "DECLARE @OUTPUT_KEY VARCHAR(50) = CONVERT(VARCHAR(50), NEWID())"
            cursor.execute(query, ())
            row = cursor.fetchone()
            if row == None:
                return ("", "Failed to get new id")
            else:
                return(row[0], "")
        except pymssql.Error as e:
            print(str(e))
            return ("", str(e))

    def list(self):
        try:
            cursor = self.__connection__.cursor()
            query = "select * from %s" % (self.__tablename__)
            cursor.execute(query, ())
            rows = cursor.fetchall()
            return (rows, "")
        except pymssql.Error as e:
            print(str(e))
            return (None, str(e))


    def readone(self, key):
        try:
            cursor = self.__connection__.cursor()
            query = "select * from %s where %s = %s" % (self.__tablename__, self.__primarykey__, "%s")
            cursor.execute(query, (key, ))
            rows = cursor.fetchone()
            return (rows, "")
        except pymssql.Error as e:
            print(str(e))
            return (None, str(e))


    def insert(self, data):
        try:
            cursor = self.__connection__.cursor()
            params = list()
            for row in data:
                fieldnames = ""
                fieldvalues = ""
                params.clear()
                index = 0
                for attribute, value in row.items():
                    fieldnames = fieldnames + attribute + ","
                    fieldvalues = fieldvalues + "%s,"
                    params.insert(index, value)
                    index = index + 1
                fieldnames = fieldnames[:-1]
                fieldvalues = fieldvalues[:-1]

                query = "insert into %s(%s) values(%s)" % (self.__tablename__, fieldnames, fieldvalues)
                cursor.execute(query, tuple(params))

            self.__connection__.commit()
            return (True, "")
        except pymssql.Error as e:
            self.__connection__.rollback()
            print(str(e))
            return (False, str(e))


    def update(self, key, data):
        try:
            cursor = self.__connection__.cursor()
            params = list()
            for row in data:
                fieldset = ""
                params.clear()
                index = 0
                for attribute, value in row.items():
                    fieldset = fieldset + attribute + "=%s,"
                    params.insert(index, value)
                    index = index + 1
                fieldset = fieldset[:-1]

                query = "update %s set %s where %s=%s" % (self.__tablename__, fieldset, self.__primarykey__, "%s")
                
                params.insert(index, key)
                cursor.execute(query, tuple(params))

            self.__connection__.commit()
            return (True, "")
        except pymssql.Error as e:
            self.__connection__.rollback()
            print(str(e))
            return (False, str(e))


    def delete(self, key):
        try:
            cursor = self.__connection__.cursor()
            query = "delete from %s where %s = %s" % (self.__tablename__, self.__primarykey__, "%s")
            cursor.execute(query, (key, ))
            self.__connection__.commit()

            return (True, "")
        except pymssql.Error as e:
            self.__connection__.rollback()
            print(str(e))
            return (False, str(e))


    def delete_flag(self, key):
        try:
            cursor = self.__connection__.cursor()
            query = "update %s set deleteflag = 1 where %s = %s" % (self.__tablename__, self.__primarykey__, "%s")
            cursor.execute(query, (key, ))
            self.__connection__.commit()

            return (True, "")
        except pymssql.Error as e:
            self.__connection__.rollback()
            print(str(e))
            return (False, str(e))


class BaseQuery(BaseModel):

    def __init__(self):
        super().__init__()