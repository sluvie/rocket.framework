import xdrlib
from app.models.base import BaseQuery

class User(BaseQuery):

    def __init__(self):
        self.__database__ = 'mpmds'
        super().__init__()


    def profile(self, npk):
        result = []
        try:
            result, message = self.callproc("EXEC MPMIT_DATAUSER %s", (npk, ))
            person = {}
            for x in result:
                person = {
                    'npk': x[0],
                    'name':x[1],
                    'division':x[2],
                    'company':x[3],
                    'department':x[4],
                    'divisionid': x[5],
                    'departmentid': x[6],
                    'email':x[7],
                    'position':x[9],
                    'ttd': x[10]
                }
            return (person, message)
        except Exception as e:
            print(str(e))
            return (None, str(e))