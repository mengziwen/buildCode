var json={
    content:{
        name:'岗位',
        englishName:'station',
        interfaceName:'/auth/stations',
        interfaceSearch:'/auth/stations/station',
        idName:'stationId',
        nameName:'stationName',
        dataName:'stationInfos',
        table:[
            {
                title:"岗位名称",
                key:"stationName"
            },
            {
                title:"使用人数",
                key:"stationUserCount"
            }
        ]

    }
};
module.exports = json;